import insertUser from '@/sql/insertUser';
import selectConversation from '@/sql/selectConversation';
import selectUser from '@/sql/selectUser';
import authenticate from '@/utils/authenticate';
import { setHeaders } from '@/utils/middleware';
export default async function handler(req, res) {
	if (!setHeaders(req, res, ['GET'])) {
		return;
	}

	//verify
	console.log('flag@@@@@@@@@@@@@@@@@@@@@@');
	const authentication = await authenticate(req, res);
	if (!authentication.status) {
		return;
	}
	try {
		const userEmail = authentication.data.userEmail;
		const userData = await selectUser(userEmail);
		console.log('userData: ', userData);
		let userId;
		if (userData.recordset.length === 0) {
			// 유저가 없으면
			const insertData = await insertUser(
				verifyResponse.data.userName,
				verifyResponse.data.userEmail,
			);
			console.log('insert user data: ', insertData);
			userId = insertData.recordset[0].user_id;
		} else {
			//유저가 있으면
			userId = userData.recordset[0].user_id;
		}
		const selectConverData = await selectConversation(userId);
		res.status(200).json(selectConverData.recordset);
		// const conversationId = insertConverData.recordset[0].conversation_id;
		// res.status(201).json({
		// 	message: 'conversation created',
		// 	conversationId: conversationId,
		// });
	} catch (error) {
		console.log('error : ', error);
		res.status(400).send(error);
	}

	// const userId =
}
