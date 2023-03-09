import { getSql } from '@/utils/cache';

export default function (userName, userEmail) {
	return new Promise((resolve, reject) => {
		getSql().then((sqlPool) => {
			sqlPool
				.request()
				.input('user_name', userName)
				.input('user_email', userEmail)
				.query(
					'INSERT INTO UserTable (user_name, user_email) OUTPUT INSERTED.user_id VALUES (@user_name, @user_email)',
				)
				.then((result) => {
					resolve(result);
				})
				.catch((err) => {
					reject(err);
				});
		});
	});
}
