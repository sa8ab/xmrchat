
export const uploadImage = async (file: File) => {
	const uuid = crypto.randomUUID();
	const name = `${uuid}.${file.type.split('/')[1]}`;

	const path = `${process.env.FILE_UPLOAD_PATH}/${name}`;

	Bun.write(path, file);
	return uuid;
};
