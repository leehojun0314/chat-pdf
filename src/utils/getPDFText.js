// import * as pdfjsLib from 'pdfjs-dist/build/pdf.js';
// pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';
// export default async function getPDFText(fileUrl) {
// 	const pdf = await pdfjsLib.getDocument(fileUrl).promise;

// 	// // 페이지에서 텍스트 추출하기
// 	// const page = await pdf.getPage(1);
// 	// const textContent = await page.getTextContent();
// 	// const text = textContent.items.map((s) => s.str).join(' ');

// 	//모든 페이지에서 텍스트 추출하기
// 	const numPages = pdf.numPages;
// 	const textPromises = [];
// 	for (let i = 1; i <= numPages; i++) {
// 		textPromises.push(
// 			pdf.getPage(i).then((page) => {
// 				return page.getTextContent();
// 			}),
// 		);
// 	}
// 	const texts = await Promise.all(textPromises);
// 	let allTexts = '';
// 	texts.forEach((textContent) => {
// 		allTexts += textContent.items.map((s) => s.str).join(' ');
// 	});
// 	return allTexts;
// }
import PdfParse from 'pdf-parse';
import AWS from 'aws-sdk';
import configs from '../../config/configs';
const s3 = new AWS.S3({
	accessKeyId: configs.s3.AWS_ACCESS_KEY_ID,
	secretAccessKey: configs.s3.AWS_SECRET_ACCESS_KEY,
});

export default async function getPDFText(fileUrl) {
	console.log('file url before split: ', fileUrl);
	const url = new URL(fileUrl);
	const bucket = url.hostname.split('.')[0];
	const key = url.pathname.slice(1); //첫번째 슬래시 제거
	console.log('bucket: ', bucket);
	console.log('key: ', key);
	return new Promise((resolve, reject) => {
		s3.getObject(
			{
				Bucket: bucket,
				Key: key,
			},
			(err, data) => {
				if (err) {
					console.log('s3 error: ', err);
					reject(err);
				} else {
					PdfParse(data.Body)
						.then((result) => {
							resolve(result.text);
						})
						.catch((err) => {
							console.log('err : ', err);
							reject(err);
						});
				}
			},
		);
	});
}
