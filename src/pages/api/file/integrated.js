// import { allowCors, checkMethod } from '@/utils/middleware';
// import aws from 'aws-sdk';
// import formidable from 'formidable';
// import fs from 'fs';
// import * as pdfjsLib from 'pdfjs-dist/build/pdf.js';
// pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';
// import configs from '../../../../config/configs';

// const S3_BUCKET_NAME = configs.s3.S3_BUCKET_NAME; // S3 버킷 이름을 입력하세요.
// const AWS_ACCESS_KEY_ID = configs.s3.AWS_ACCESS_KEY_ID; // AWS Access Key ID를 입력하세요.
// const AWS_SECRET_ACCESS_KEY = configs.s3.AWS_SECRET_ACCESS_KEY; // AWS Secret Access Key를 입력하세요.

// const s3 = new aws.S3({
// 	accessKeyId: AWS_ACCESS_KEY_ID,
// 	secretAccessKey: AWS_SECRET_ACCESS_KEY,
// });

// export const config = {
// 	api: {
// 		bodyParser: false,
// 	},
// };

async function handler(req, res) {
	res.send('hello');
	// if (!checkMethod(req, res, ['POST'])) {
	// 	return;
	// }
	// if (!runCorsMiddleware(req, res)) {
	// 	return;
	// }

	// const form = formidable({ multiples: false });
	// form.parse(req, async (err, fields, files) => {
	// 	if (err) {
	// 		console.error(err);
	// 		res.status(500).send('Internal Server Error');
	// 		return;
	// 	}

	// 	const file = files['file'];
	// 	const s3Key = `uploads/${file.originalFilename}`;
	// 	console.log('file: ', file);
	// 	const fileStream = file ? fs.createReadStream(file.filepath) : null;
	// 	console.log('fileStream: ', fileStream);
	// 	const params = {
	// 		Bucket: S3_BUCKET_NAME,
	// 		Key: s3Key,
	// 		Body: fileStream,
	// 		ContentType: 'application/pdf',
	// 		ACL: 'public-read',
	// 	};
	// 	try {
	// 		//파일 업로드
	// 		const result = await s3.upload(params).promise();
	// 		const fileUrl = result.Location;
	// 		console.log('file url: ', fileUrl);
	// 		// PDF 문서 열기
	// 		const data = new Uint8Array(
	// 			await fetch(fileUrl).then((res) => res.arrayBuffer()),
	// 		).buffer;

	// 		const pdf = await pdfjsLib.getDocument(data).promise;

	// 		// 첫 번째 페이지 가져오기
	// 		const page = await pdf.getPage(1);

	// 		// 페이지에서 텍스트 추출하기
	// 		const textContent = await page.getTextContent();
	// 		const text = textContent.items.map((s) => s.str).join(' ');
	// 		console.log('text: ', text);
	// 		res.status(200).json({ text, fileUrl });
	// 	} catch (error) {
	// 		console.error(error);
	// 		res.status(500).send('Internal Server Error');
	// 	}
	// });
}
export default handler;
