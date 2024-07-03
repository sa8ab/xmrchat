
import { t } from 'elysia';
import { UserObject } from './_objects';
import { username, password, email, is_email_verified } from './components/users';
import { ids } from './components/_general';

export const CreateUserSchema = {
	payload: {
		body: t.Object({
			username,
			password,
			email: t.Optional(email),

		}),
	},
	response: t.Object({ id: ids.user_id, is_email_verified, otp: t.Number() }),
};

export const LoginUserSchema = {
	payload: {
		body: t.Object({
			username,
			password,
		}),
	},
	response: t.Object({}),
};

export const TokenVerification = {
	// payload: {
	// 	body: t.Object({
	// 		username,
	// 		password,
	// 	}),
	// },
	response: t.Object({})
};

