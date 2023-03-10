import selectMessage from '@/sql/selectMessage';
import authenticate from '@/utils/authenticate';
import { checkMethod, runCorsMiddleware } from '@/utils/middleware';

export default async function (req, res) {
	if (!checkMethod(req, res, ['GET'])) {
		return;
	}
	if (!runCorsMiddleware(req, res)) {
		return;
	}
	const authentication = await authenticate(req, res);
	if (!authentication.status) {
		return;
	}
	const conversationId = req.query.convId || '';
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
