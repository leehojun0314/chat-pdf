import insertMessage from '@/sql/insertMessage';
import selectMessage from '@/sql/selectMessage';
import authenticate from '@/utils/authenticate';
import { setHeaders } from '@/utils/middleware';
import sendToAi from '@/utils/sendToAI';

export default async function ChatAi(req, res) {
	console.log('req body: ', req.body);
	if (!setHeaders(req, res, ['POST'])) {
		return;
	}
	// if (!runCorsMiddleware(req, res)) {
	// 	return;
	// }
	// const authentication = await authenticate(req, res);
	// if (!authentication.status) {
	// 	return;
	// }

	// const text = req.body.text || '';
	// console.log('text: ', text);
	const conversationId = req.body.conversationId || '';
	const message = req.body.text;
	if (!conversationId) {
		res.status(404).send('please enter a valid conversation id');
	}
	try {
		const messagesResult = await selectMessage(conversationId);
		console.log('messagesResult: ', messagesResult);
		const { messages, answer } = await sendToAi(
			messagesResult.recordset,
			message,
		);
		console.log('messages , answer : ', messages);
		//내가 보낸 내용 insert
		await insertMessage({
			message: message,
			sender: 'user',
			messageOrder: messagesResult.recordset.length,
			conversationId: conversationId,
		});
		//ai가 보낸 내용 insert
		await insertMessage({
			message: answer.content,
			sender: 'assistant',
			messageOrder: messagesResult.recordset.length + 1,
			conversationId: conversationId,
		});
		const messagesFinalResult = await selectMessage(conversationId);
		res.status(200).json({
			messages: messagesFinalResult.recordset,
			answer: answer.content,
		});
	} catch (error) {
		// console.log('err: ', error);
		res.status(400).send(error);
	}
}
