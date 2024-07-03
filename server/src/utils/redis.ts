
import { createClient } from 'redis';

const client = createClient({
	url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
}).on('error', err => {
	console.error('Redis error: ', err);
});

export const createConnection = async () => {
	if (client.isOpen) {
		return client;
	}
	return await client.connect();
};
