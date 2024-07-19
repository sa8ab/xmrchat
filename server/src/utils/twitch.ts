import axios from 'axios';
import { client } from 'tmi.js'
import { type Options, Client } from 'tmi.js'
import { db } from '../db/connect';
import schedule from 'node-schedule';

interface refreshTokenResponse {
    "access_token": string;
    "refresh_token": string;
    "scope": string[];
    "token_type": string;
}

export default class Twitch {
    public channel: string;

    public static clientId = process.env.TWITCH_CLIENT_ID;
    public static clientSecret = process.env.TWITCH_CLIENT_SECRET;
    public static botName = process.env.TWITCH_BOT_NAME;
    public static initialAccessToken = process.env.TWITCH_INITIAL_ACCESS_TOKEN;
    public static initialRefreshToken = process.env.TWITCH_INITIAL_REFRESH_TOKEN;


    public twitchClient: Client;
    constructor(channel: string, ops: Options) {
        ops.channels = [channel]
        const twitchClient = new client(ops);


        twitchClient.on('connected', (addr, port) => {
            console.log(`* Connected to ${addr}:${port} and channels ${channel}`);
        });

        this.twitchClient = twitchClient
        this.channel = channel
    }

    public static async getInstance(channel: string) {

        const twitchSettingsRaw = await db
            .selectFrom('settings')
            .select(['id', 'key', 'value'])
            .where('key', '=', 'twitch')
            .executeTakeFirst();
        let twitchSettings
        if (!!twitchSettingsRaw) {
            twitchSettings = JSON.parse(twitchSettingsRaw?.value || '')
        } else {
            twitchSettings = {
                access_token: Twitch.initialAccessToken,
                refreshToken: Twitch.initialRefreshToken
            }
        }


        const ops: Options = {
            options: {
                debug: true,
                clientId: Twitch.clientId
            },
            identity: {
                username: Twitch.botName,
                password: 'oauth:' + twitchSettings.access_token
            }
        }

        return new Twitch(channel, ops)
    }


    public async sendMessage(message: string) {
        try {
            console.log('sendMessage is called.')
            await this.twitchClient.connect();
            await this.twitchClient.say(this.channel, message);
            await this.twitchClient.disconnect();
        } catch (error) {
            console.log('ERROR at twitch message sending:', error)
        }

    }

    public static async tokenUpdatingSchedule() {
        await Twitch.tokenUpdating()
        schedule.scheduleJob("0 0 * * 0", Twitch.tokenUpdating);
    }


    public static async tokenUpdating() {
        try {
            const twitchSettingsRaw = await db
                .selectFrom('settings')
                .select(['id', 'key', 'value'])
                .where('key', '=', 'twitch')
                .executeTakeFirst();
            let twitchSettings
            if (!!twitchSettingsRaw) {
                twitchSettings = JSON.parse(twitchSettingsRaw?.value || '')
            } else {
                twitchSettings = {
                    access_token: Twitch.initialAccessToken,
                    refresh_token: Twitch.initialRefreshToken
                }
            }
            const params = new URLSearchParams();
            params.append('grant_type', 'refresh_token');
            params.append('refresh_token', twitchSettings.refresh_token);
            params.append('client_id', Twitch.clientId);
            params.append('client_secret', Twitch.clientSecret);

            const response = (await axios.post('https://id.twitch.tv/oauth2/token', params)).data
            
            await db
                .insertInto('settings')
                .values({
                    key: 'twitch',
                    value: JSON.stringify({
                        refresh_token: response.refresh_token,
                        access_token: response.access_token,
                        expires_in: response.expires_in
                    }),
                })
                .execute();

        } catch (error) {
            console.log('ERROR at twitch refresh token api', error.response)
        }
    }

}