
import {OpenAPIV3} from 'openapi-types';
import {t} from 'elysia';
import type {TArray, TMappedResult, TObject} from '@sinclair/typebox';

import {AppResponseType} from './appResponse';

/**
 * Builds swagger documentation based on response schemas.
 */
const buildResponseDocumentation = (
	schemas: Record<string, TMappedResult | TArray | TObject>
): OpenAPIV3.ResponsesObject => {
	const result: OpenAPIV3.ResponsesObject = {};
	Object.keys(schemas).forEach(statusCode => {
		const schema = schemas[statusCode];

		result[statusCode] = {
			description: 'OK',
			content: {
				'application/json': {
					schema: t.Object({
						responseType: t.Enum(AppResponseType),
						message: t.String(),
						data: t.Optional(schema),
						statusCode: t.Enum(t.Number()),
					}),
				},
			},
		};
	});

	return result;
};

export {buildResponseDocumentation};
