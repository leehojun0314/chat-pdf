import insertConversation from '@/sql/insertConversation';
import insertMessage from '@/sql/insertMessage';
import insertUser from '@/sql/insertUser';
import selectUser from '@/sql/selectUser';
import authenticate from '@/utils/authenticate';
import { initMessageGenerator } from '@/utils/generator';
import getPDFText from '@/utils/getPDFText';
import { setHeaders } from '@/utils/middleware';
import { uploadS3 } from '@/utils/uploadS3';
export const config = {
	api: {
		bodyParser: false,
	},
};
export default async function handler(req, res) {
	if (!setHeaders(req, res, ['POST'])) {
		return;
	}

	const authentication = await authenticate(req, res);
	if (!authentication.status) {
		return;
	}
	try {
		const userEmail = authentication.data.userEmail;
		const userData = await selectUser(userEmail);
		let userId;
		if (userData.recordset.length === 0) {
			// 유저가 없으면
			const insertData = await insertUser(
				authentication.data.userName,
				authentication.data.userEmail,
			);
			userId = insertData.recordset[0].user_id;
		} else {
			//유저가 있으면
			userId = userData.recordset[0].user_id;
		}
		//upload s3
		const { fileUrl, fields } = await uploadS3(req);

		const conversationName = fields.conversationName;

		//text 변환
		const allTexts = await getPDFText(fileUrl);
		//conversation 생성
		const insertConverData = await insertConversation(
			conversationName,
			userId,
		);
		//초기 메세지 생성
		const message = initMessageGenerator(
			insertConverData.recordset[0].conversation_id,
			allTexts,
		);
		//생성된 초기 메세지 삽입
		const messageResult = await insertMessage(message);
		const conversations = insertConverData.recordset;
		res.status(201).json({
			message: 'conversation created',
			conversations,
		});
	} catch (error) {
		console.log('error : ', error);
		res.status(400).send(error);
	}
}
