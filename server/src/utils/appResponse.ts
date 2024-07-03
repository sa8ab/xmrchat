
export const AppResponseType = {
	success: 'success',
	error: 'error',
	internalError: 'internalError',
	notFound: 'notFound',
} as const;

export type AppResponseOptions<T = unknown> = {
	responseType: (typeof AppResponseType)[keyof typeof AppResponseType];
	message: string;
	data?: T;
	statusCode?: number;
};

class AppResponse<T = unknown> extends Error {
	responseType: AppResponseOptions['responseType'];
	message: string;
	data?: T;
	statusCode: number;

	constructor(options: AppResponseOptions<T>) {
		super(options.message);
		this.responseType = options.responseType;

		if (!options.statusCode) {
			switch (this.responseType) {
				case 'success':
					this.statusCode = 200;
					break;
				case 'error':
					this.statusCode = 400;
					break;
				case 'internalError':
					this.statusCode = 500;
					break;
				case 'notFound':
					this.statusCode = 404;
					break;
			}
		} else {
			this.statusCode = options.statusCode;
		}

		this.message = options.message;
		this.data = options.data;
	}

	toJSON() {
		return {
			responseType: this.responseType,
			message: this.message,
			data: this.data,
		};
	}

	static notFound<T>(data?: T) {
		return new AppResponse<T>({
			responseType: 'error',
			message:
				'The requested resource was not found, please try again later.',
			statusCode: 404,
			data,
		});
	}

	static badRequest<T>(data?: T) {
		return new AppResponse({
			responseType: 'error',
			message: 'You sent an invalid request, please try again.',
			statusCode: 400,
			data,
		});
	}

	static unauthorized<T>(data?: T) {
		return new AppResponse({
			responseType: 'error',
			message:
				'You must be logged-in to access this resource. Please log in and try again.',
			statusCode: 401,
			data,
		});
	}

	static internalServerError<T>(data?: T) {
		return new AppResponse({
			responseType: 'internalError',
			message: 'Something went wrong, please try again later.',
			statusCode: 500,
			data,
		});
	}
}

export {AppResponse};
