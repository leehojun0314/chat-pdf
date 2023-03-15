import insertMessage from '@/sql/insertMessage';
import authenticate from '@/utils/authenticate';
import { initMessageGenerator } from '@/utils/generator';
import getPDFText from '@/utils/getPDFText';
import { setHeaders } from '@/utils/middleware';
export default async function (req, res) {
	// if (!setHeaders(req, res, ['GET'])) {
	// 	return;
	// }

	const fileUrl = req.body.fileUrl;
	if (!fileUrl) {
		res.status(400).send('please enter valid url');
		return;
	}
	const authentication = await authenticate(req, res);
	if (!authentication.status) {
		return;
	}

	// const fileUrl =
	// 	'https://jemixhomefileupload.s3.ap-northeast-2.amazonaws.com/uploads/QA.pdf';
	let allTexts = await getPDFText(fileUrl);
	try {
		const message = initMessageGenerator(7, allTexts);
		const messageResult = await insertMessage(message);
		res.status(200).json({ allTexts });
	} catch (err) {
		console.log('err: ', err);
		res.status(400).send(err);
	}
}
