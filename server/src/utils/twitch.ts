import axios from 'axios';
import { client } from 'tmi.js'
import { type Options, Client } from 'tmi.js'
import { db } from '../db/connect';
import schedule from 'node-schedule';
import {
    TextCensor,
    RegExpMatcher,
    englishDataset,
    englishRecommendedTransformers,
} from 'obscenity';
const badWordMatcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
});

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
        console.log({ twitchOPS: ops })
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

        const configs = await Twitch.tokenUpdating()


        console.log({ lastSetting: twitchSettings })


        console.log('TWITCHHH', { configs, twitchSettings })
        const ops: Options = {
            options: {
                debug: true,
                clientId: Twitch.clientId
            },
            identity: {
                username: Twitch.botName,
                password: 'oauth:' + configs?.access_token
            }
        }

        return new Twitch(channel, ops)
    }
    public static clearMessage(message: string) {
        const censor = new TextCensor()
        const matches = badWordMatcher.getAllMatches(message);
        const clearedMessaged = censor.applyTo(message, matches)
        console.log(clearedMessaged)
    }


    public async sendMessage(message: string) {
        try {
            console.log('sendMessage is called.')
            const censor = new TextCensor()
            const matches = badWordMatcher.getAllMatches(message);
            const clearedMessaged = censor.applyTo(message, matches)
            await this.twitchClient.connect();
            await this.twitchClient.say(this.channel, clearedMessaged);
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
            console.log({ twitchSettingsRaw })
            let twitchSettings
            if (!!twitchSettingsRaw) {
                twitchSettings = JSON.parse(twitchSettingsRaw?.value || '')
            } else {
                twitchSettings = {
                    access_token: Twitch.initialAccessToken,
                    refresh_token: Twitch.initialRefreshToken
                }
            }
            console.log({ twitchSettings })
            const params = new URLSearchParams();
            params.append('grant_type', 'refresh_token');
            params.append('refresh_token', twitchSettings.refresh_token);
            params.append('client_id', Twitch.clientId);
            params.append('client_secret', Twitch.clientSecret);

            const response = (await axios.post('https://id.twitch.tv/oauth2/token', params)).data
            console.log({ response }, response.access_token, response.refresh_token)

            if (!!twitchSettingsRaw) {
                const result = {
                    refresh_token: response.refresh_token,
                    access_token: response.access_token,
                    expires_in: response.expires_in
                }
                await db
                    .updateTable('settings')
                    .set({
                        key: 'twitch',
                        value: JSON.stringify(result),
                    })
                    .where('key', '=', 'twitch')
                    .execute()
                return result
            }

            const result = {
                refresh_token: response.refresh_token,
                access_token: response.access_token,
                expires_in: response.expires_in
            }
            await db
                .insertInto('settings')
                .values({
                    key: 'twitch',
                    value: JSON.stringify(result),
                })
                .execute();
            return result

        } catch (error) {
            console.log('ERROR at twitch refresh token api', (error as any).response)
        }
    }

}