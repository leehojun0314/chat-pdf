import { getSql } from '@/utils/cache';

export default function (email) {
	return new Promise((resolve, reject) => {
		getSql()
			.then((sqlPool) => {
				sqlPool
					.request()
					.query(`SELECT * FROM UserTable WHERE user_email = '${email}'`)
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
