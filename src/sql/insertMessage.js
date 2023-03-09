import { getSql } from '@/utils/cache';

export default function (message, conversation_id, sender, messageOrder) {
	return new Promise((resolve, reject) => {
		getSql()
			.then((sqlPool) => {
				sqlPool
					.request()
					.input('message', message)
					.input('conversation_id', conversation_id)
					.input('sender', sender)
					.input('message_order', messageOrder)
					.query(
						`INSERT INTO Message (message, conversation_id, sender, message_order)
    VALUES (@message, @conversation_id, @sender, @message_order)`,
					)
					.then((result) => {
						console.log('result: ', result);
						resolve(result);
					})
					.catch((err) => {
						console.log('insert message error : ', err);
						reject(err);
					});
			})
			.catch((err) => {
				reject(err);
			});
	});
}
