import * as pdfjsLib from 'pdfjs-dist/build/pdf.js';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';
export default async function getPDFText(fileUrl) {
	const pdf = await pdfjsLib.getDocument(fileUrl).promise;

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
	return allTexts;
}
