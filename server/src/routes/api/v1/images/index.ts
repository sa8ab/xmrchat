
import type {ElysiaApp} from '../../../../index';

import {uploadImage} from '../../../../utils/uploadImage';

export default (app: ElysiaApp) => {
	return app
		.get('/:image_name', async ({params}) => {
			const filePng = Bun.file(
				`${process.env.FILE_UPLOAD_PATH}/${params.image_name}.png`
			);

			const pExists = await filePng.exists();

			if (pExists) {
				return filePng;
			}

			const fileJpeg = Bun.file(
				`${process.env.FILE_UPLOAD_PATH}/${params.image_name}.jpeg`
			);
			const jExists = await fileJpeg.exists();

			if (jExists) {
				return fileJpeg;
			}

			return {error: 'Not found', status: 404};
		})
		.post('/', async ({user, body}) => {
			if (!user) {
				return {error: 'Unauthorized', status: 401};
			}

			if (
				!body ||
				typeof body !== 'object' ||
				Object.keys(body).length === 0
			) {
				return {error: 'Invalid body', status: 400};
			}

			const file = body[Object.keys(body)[0] as keyof typeof body];
			if (!file) {
				return {error: 'No file found', status: 400};
			}

			const id = await uploadImage(file);
			return {id};
		});
};
