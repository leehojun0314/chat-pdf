import { getSql } from '@/utils/cache';
export default function ({ message, conversationId, sender, messageOrder }) {
	return new Promise((resolve, reject) => {
		console.log('message before query: ', message);
		getSql()
			.then((sqlPool) => {
				sqlPool
					.request()
					.input('message', message)
					.input('conversation_id', conversationId)
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
