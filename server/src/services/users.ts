
import { db } from '../db/connect';
import { HashPassword } from '../utils/password';
import { lucia } from '../utils/auth';

import { randomBytes } from 'crypto';
import { sendOTPMail } from '../utils/mailer'
import { expires_at, token } from '../schemas/components/user_tokens';
import { is_email_verified } from '../schemas/components/users';
import type { Users } from '../types/db';


const SendEmailVerification = async (userId: string, email: string = "", type: string = 'EMAIL_VERIFICATION') => {

	const existingToken = await db
		.selectFrom('user_tokens')
		.selectAll()
		.where('user_id', '=', userId)
		.where('type', '=', type)
		.where('expires_at', '>', new Date())
		.executeTakeFirst();

	console.log(existingToken)
	if (!!existingToken) {
		throw new Error("The request already be sent.");

	}
	const otp = await sendOTPMail(email, type)

	const tokenId = await db
		.insertInto('user_tokens')
		.values({
			user_id: userId,
			token: otp,
			expires_at: new Date(new Date().getTime() + 600000), // 10 minute later
			type: type
		})
		.returning('id')
		.executeTakeFirst();

	if (!tokenId) throw new Error("Token creation error.");
	return { tokenId, otp }

}


const UserResetPassword = async (payload: {
	email?: string;
}) => {
	try {
		console.log(payload)
		const user = await db
			.selectFrom('users')
			.selectAll()
			.where('email', '=', payload.email)
			.executeTakeFirst();
		console.log(user)
		if (!user) {
			return { message: 'reset password link is sent into your mailbox.', status: 200 };
		}


		const { otp } = await SendEmailVerification(user.id, user.email, 'RESET_PASSWORD')
		console.log(otp)

		return { message: 'reset password link is sent into your mailbox.' + otp, status: 200 };

	} catch (error: any) {
		return { error: error.message, status: 500 };

	}

}
/**
 * Creates a new user.
 */
const CreateUser = async (payload: {
	username: string;
	password: string;
	email?: string;
}) => {



	const existingUser = await db
		.selectFrom('users')
		.select('id')
		.where('username', '=', payload.username)
		.executeTakeFirst();

	if (existingUser) {
		return { error: 'Username already exists', status: 409 };
	}

	const salt = randomBytes(32).toString('hex');
	payload.password = HashPassword(payload.password, salt);
	const user = await db
		.insertInto('users')
		.values({
			username: payload.username,
			password: payload.password,
			password_salt: salt,
			is_email_verified: false,
			email: payload.email,
		})
		.returning('id')
		.executeTakeFirst();
	if (!user) {
		return { error: 'An error occurred', status: 500 };
	}
	const { tokenId, otp } = await SendEmailVerification(user.id, payload.email)

	if (!tokenId) {
		return { error: 'An error occurred', status: 500 };
	}
	// const session = await lucia.createSession(id.id, {});
	// const sessionCookie = lucia.createSessionCookie(session.id);

	// console.log(user, user.id)
	return { user_id: user.id, is_email_verified: false, otp }
	// return new Response(JSON.stringify({ user_id: userId.id, is_email_verified: false, otp }), {
	// 	status: 200,
	// 	// headers: {
	// 	// 'Set-Cookie': sessionCookie.serialize(),
	// 	// },
	// });
};


/**
 * Logs in as a user.
 */
const LoginUser = async (payload: { username: string; password: string }) => {

	const user = await db
		.selectFrom('users')
		.selectAll()
		.where('username', '=', payload.username)
		.executeTakeFirst();
	if (!user) {
		return { error: 'Incorrect username/password', status: 401 };
	}

	if (user.password !== HashPassword(payload.password, user.password_salt)) {
		return { error: 'Incorrect username/password', status: 401 };
	}
	if (!user.is_email_verified) {
		try {
			const { otp } = await SendEmailVerification(user.id, user.email)
			return { error: 'Please confirm your mail' + otp, status: 401 };
		} catch (error) {
			return { error: 'Please confirm your mail. the confirmation mail is sent to your mailbox.', status: 401 };
		}

	}

	const session = await lucia.createSession(user.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	return new Response(JSON.stringify({ user_id: user.id }), {
		status: 200,
		headers: {
			'Set-Cookie': sessionCookie.serialize(),
		},
	});
};


const TokenVerification = async (payload: { token: string; type: string, password: string }) => {


	try {


		console.log('TokenVerification')
		const existingToken = await db
			.selectFrom('user_tokens')
			.selectAll()
			.where('token', '=', payload.token)
			.where('expires_at', '>', new Date())
			.executeTakeFirst();

		if (!existingToken) {
			return { error: 'token dosen\'t exists.', status: 404 };
		}

		if (existingToken.type != payload.type.toUpperCase()) {
			return { error: `token dosen\'t assign to this task. Its for ${existingToken.type.toLowerCase()}`, status: 403 };
		}

		var verificationActions: any = {};

		verificationActions['EMAIL_VERIFICATION'] = async function () {
			const user = (await db
				.updateTable('users')
				.set({
					is_email_verified: true,
				})
				.where('id', '=', existingToken.user_id)
				.returning('id')
				.execute())[0];

			if (!user.id) return { error: 'Unkown user updating error. sorry.', status: 500 };


			await db
				.deleteFrom('user_tokens')
				.where('token', '=', payload.token)
				.execute();


			return { userId: existingToken.user_id, is_email_verified: true }
		};
		verificationActions['RESET_PASSWORD'] = async function () {

			console.log("resetpassword")
			if (!payload.password) return { error: `please insert new password`, status: 400 };
			console.log(payload.password)

			const salt = randomBytes(32).toString('hex');
			payload.password = HashPassword(payload.password, salt);
			console.log(payload.password)
			const user = (await db
				.updateTable('users')
				.set({
					password: payload.password,
					password_salt: salt
				})
				.where('id', '=', existingToken.user_id)
				.returning('id')
				.execute())[0];

			console.log(user)
			if (!user.id) return { error: 'Unkown user updating error. sorry.', status: 500 };


			await db
				.deleteFrom('user_tokens')
				.where('token', '=', payload.token)
				.execute();


			return { userId: existingToken.user_id, is_email_verified: true }
		};

		console.log(payload.type.toUpperCase())
		return await verificationActions[payload.type.toUpperCase()]()

	} catch (error: any) {
		return { error: error.message, status: 500 };
	}
};


export default { CreateUser, LoginUser, TokenVerification, UserResetPassword };


