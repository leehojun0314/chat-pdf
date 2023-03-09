import insertConversation from '@/sql/insertConversation';
import insertMessage from '@/sql/insertMessage';
import { getSql } from '@/utils/cache';
import { initMessageGenerator } from '@/utils/generator';
import { checkMethod, runCorsMiddleware } from '@/utils/middleware';
// import { Text } from 'mssql';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.js';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';
export default async function (req, res) {
	if (!checkMethod(req, res, ['GET'])) {
		return;
	}
	if (!runCorsMiddleware(req, res)) {
		return;
	}
	// const fileUrl = req.body.fileUrl;
	// if (!fileUrl) {
	// 	res.status(400).send('please enter valid url');
	// 	return;
	// }
	const fileUrl =
		'https://jemixhomefileupload.s3.ap-northeast-2.amazonaws.com/uploads/QA.pdf';
	const data = new Uint8Array(
		await fetch(fileUrl).then((res) => res.arrayBuffer()),
	).buffer;
	const pdf = await pdfjsLib.getDocument(data).promise;

	// // 페이지에서 텍스트 추출하기
	// const page = await pdf.getPage(1);
	// const textContent = await page.getTextContent();
	// const text = textContent.items.map((s) => s.str).join(' ');

	//모든 페이지에서 텍스트 추출하기
	const numPages = pdf.numPages;
	const textPromises = [];
	for (let i = 1; i <= numPages; i++) {
		textPromises.push(
			pdf.getPage(i).then((page) => {
				return page.getTextContent();
			}),
		);
	}
	const texts = await Promise.all(textPromises);
	let allTexts = '';
	texts.forEach((textContent) => {
		allTexts += textContent.items.map((s) => s.str).join(' ');
	});
	try {
		const converResult = await insertConversation('testname', 1);
		const message = initMessageGenerator(
			converResult.recordset[0].ID,
			allTexts,
		);
		console.log('message: ', message);
		const messageResult = await insertMessage(...message);
		console.log('sqlResult:', messageResult);
		res.status(200).json({ allTexts });
	} catch (err) {
		console.log('err: ', err);
		res.status(400).send(err);
	}
}
