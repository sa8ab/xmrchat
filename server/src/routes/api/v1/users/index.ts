
import type { ElysiaApp } from '../../../../index';

import { buildResponseDocumentation } from '../../../../utils/buildResponseDocumentation';

import UserService from '../../../../services/users';
import { CreateUserSchema, LoginUserSchema } from '../../../../schemas/users';
import { lucia } from '../../../../utils/auth';

const tags = ['users'];
export default (app: ElysiaApp) => {
	return app
		.get('/auth', async ({ user }) => {
			return {
				authenticated: !!user,
				user

			};
		})
		.post(
			'/',
			async ({ user, body }) => {
				if (user) {
					return { error: 'Already logged in' };
				}
				return await UserService.CreateUser({ ...body });
			},
			{
				...CreateUserSchema.payload,
				detail: {
					tags,
					summary: 'Create a new user',
					responses: buildResponseDocumentation({
						200: CreateUserSchema.response,
					}),
				},
			}
		)

		.post(
			'/auth/:type/:token',
			async ({ user, body, params }) => {
				if (user) {
					return { error: 'Already logged in' };
				}
				return await UserService.TokenVerification({ ...body, ...params });


			},
			{
				// ...CreateUserSchema.payload,
				detail: {
					tags,
					summary: 'Create a new user',
					// responses: buildResponseDocumentation({
					// 	200: CreateUserSchema.response,
					// }),
				},
			}
		)
		.post(
			'/login',
			async ({ user, body }) => {
				if (user) {
					return { error: 'Already logged in' };
				}

				return await UserService.LoginUser({ ...body });
			},
			{
				...LoginUserSchema.payload,
				detail: {
					tags,
					summary: 'Log in as a user',
					responses: buildResponseDocumentation({
						200: LoginUserSchema.response,
					}),
				},
			}
		)

		.post(
			'/reset_password',
			async ({ user, body }) => {
				if (user) {
					return { error: 'Already logged in' };
				}

				return await UserService.UserResetPassword({ ...body });
			},
			{
				// ...LoginUserSchema.payload,
				detail: {
					tags,
					summary: 'Log in as a user',
					// responses: buildResponseDocumentation({
					// 	200: LoginUserSchema.response,
					// }),
				},
			}
		)
		.get('/logout', ({ headers }) => {
			const sessionCookie = lucia.createBlankSessionCookie();
			headers['Set-Cookie'] = sessionCookie.serialize();

			return new Response(null, {
				status: 302,
				headers: {
					Location: '/',
				},
			});
		});
};
