
import { Lucia, verifyRequestOrigin } from 'lucia';
import { NodePostgresAdapter } from '@lucia-auth/adapter-postgresql';

import { pool } from '../db/connect';
import type { Users } from '../types/db';

import type { User, Session } from 'lucia';
import type { Elysia } from 'elysia';

const adapter = new NodePostgresAdapter(pool, {
	session: 'user_sessions',
	user: 'users',
});

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: false,
			domain: "xmrchat.com"
		},
		expires: true,
	},
	getUserAttributes: user => {
		delete user.password;
		delete user.password_salt;

		return user;
	},
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Partial<Users>;
	}
}

/**
 * Middleware to validate user sessions.
 */
export const SessionValidationMiddleware = (app: Elysia) => {
	return app.derive(
		async (
			context
		): Promise<{
			user: User | null;
			session: Session | null;
		}> => {
			if (context.path === '/api/v1/users/logout') {
				const cookieHeader =
					context.request.headers.get('Cookie') ?? '';
				const sessionId = lucia.readSessionCookie(cookieHeader);
				if (sessionId) {
					await lucia.invalidateSession(sessionId);
				}
				return {
					user: null,
					session: null,
				};
			}

			const authorizationHeader = context.request.headers.get("Authorization");
			const headerSessionId = lucia.readBearerToken(authorizationHeader ?? "");

			const cookieHeader = context.request.headers.get('Cookie') ?? '';
			const cookieSessionId = lucia.readSessionCookie(cookieHeader);

			const sessionId = headerSessionId || cookieSessionId
			if (!sessionId) {
				return {
					user: null,
					session: null,
				};
			}

			const { session, user } = await lucia.validateSession(sessionId);
			if (session && session.fresh) {
				const sessionCookie = lucia.createSessionCookie(session.id);
				context.cookie[sessionCookie.name].set({
					value: sessionCookie.value,
					...sessionCookie.attributes,
				});
			}
			if (!session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				context.cookie[sessionCookie.name].set({
					value: sessionCookie.value,
					...sessionCookie.attributes,
				});
			}
			return {
				user,
				session,
			};
		}
	);
};
