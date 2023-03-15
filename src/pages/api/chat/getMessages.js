import selectMessage from '@/sql/selectMessage';
import authenticate from '@/utils/authenticate';
import { runCorsMiddleware, setHeaders } from '@/utils/middleware';

export default async function (req, res) {
	// if (!setHeaders(req, res, ['GET'])) {
	// 	return;
	// }
	await runCorsMiddleware(req, res);
	// const authentication = await authenticate(req, res);
	// if (!authentication.status) {
	// 	return;
	// }
	const conversationId = req.query.convId || '';
	console.log('conversation Id : ', conversationId);
	if (!conversationId) {
		res.status(404).send('please enter a valid conversation id');
		return;
	}

	try {
		const messagesResult = await selectMessage(conversationId);
		console.log('messages: ', messagesResult);
		const shiftedMessages = [...messagesResult.recordset];
		shiftedMessages.shift();
		console.log('shifted : ', shiftedMessages);
		res.status(200).json(shiftedMessages);
	} catch (error) {
		console.log(error);
		res.status(400).send(error);
	}
}
