import { getSql } from '@/utils/cache';

export default function (userId) {
	return new Promise((resolve, reject) => {
		getSql()
			.then((sqlPool) => {
				sqlPool
					.request()
					.query(`SELECT * FROM Conversation WHERE user_id = '${userId}'`)
					.then((result) => {
						resolve(result);
					})
					.catch((err) => {
						reject(err);
					});
			})
			.catch((err) => {
				reject(err);
			});
	});
}
