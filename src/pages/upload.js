import { useState } from 'react';
import axios from 'axios';
export default function UploadPage() {
	const [file, setFile] = useState(null);

	async function handleSubmit(event) {
		event.preventDefault();

		const formData = new FormData();
		formData.append('file', file);
		console.log('form data:', formData);
		// const response = await fetch('/api/file/uploadS3', {
		// 	method: 'POST',
		// 	body: formData,
		// });

		// if (!response.ok) {
		// 	throw new Error(`HTTP error ${response.status}`);
		// }

		// const result = await response.json();
		// console.log(result.url);
		axios
			.post('/api/file/uploadS3', formData)
			.then((response) => {
				console.log('response: ', response);
			})
			.catch((err) => {
				console.log('err: ', err);
			});
	}

	function handleFileChange(event) {
		const input = event.target;
		const file = input.files[0];
		const allowedExtensions = /(\.pdf)$/i;

		if (!allowedExtensions.exec(file.name)) {
			alert('PDF 파일만 선택 가능합니다.');
			input.value = '';
			setFile(null);
			return false;
		} else {
			setFile(event.target.files[0]);
		}
	}

	return (
		<div>
			<h1>파일 업로드</h1>
			<form onSubmit={handleSubmit}>
				<input type='file' onChange={handleFileChange} accept='.pdf' />
				<button type='submit' disabled={!file}>
					업로드
				</button>
			</form>
		</div>
	);
}
