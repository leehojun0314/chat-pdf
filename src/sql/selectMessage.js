import { getSql } from '@/utils/cache';

export default function (conversationId) {
	return new Promise((resolve, reject) => {
		getSql()
			.then((sqlPool) => {
				sqlPool
					.request()
					.query(
						`SELECT * FROM Message WHERE conversation_id = '${conversationId}' ORDER BY message_order ASC`,
					)
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
