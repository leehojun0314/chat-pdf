import insertConversation from '@/sql/insertConversation';
import insertUser from '@/sql/insertUser';
import selectUser from '@/sql/selectUser';
import authenticate from '@/utils/authenticate';
import { getSql } from '@/utils/cache';
import { checkMethod, runCorsMiddleware } from '@/utils/middleware';
import axios from 'axios';
export default async function handler(req, res) {
	if (!checkMethod(req, res, ['POST'])) {
		return;
	}
	if (!runCorsMiddleware(req, res)) {
		return;
	}
	const authentication = await authenticate(req);
	if (!authentication.status) {
		res.status(404).send(authentication.data);
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
		const conversationName = req.body.conversationName;
		const insertConverData = await insertConversation(
			conversationName,
			userId,
		);
		const conversations = insertConverData.recordset;
		res.status(201).json({
			message: 'conversation created',
			conversations,
		});
	} catch (error) {
		console.log('error : ', error);
		res.status(400).send(error);
	}

	// const userId =
}
