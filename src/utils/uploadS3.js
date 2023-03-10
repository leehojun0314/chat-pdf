import aws from 'aws-sdk';
import formidable from 'formidable';
import fs from 'fs';
import configs from '../../config/configs';
const S3_BUCKET_NAME = configs.s3.S3_BUCKET_NAME; // S3 버킷 이름을 입력하세요.
const AWS_ACCESS_KEY_ID = configs.s3.AWS_ACCESS_KEY_ID; // AWS Access Key ID를 입력하세요.
const AWS_SECRET_ACCESS_KEY = configs.s3.AWS_SECRET_ACCESS_KEY; // AWS Secret Access Key를 입력하세요.

const s3 = new aws.S3({
	accessKeyId: AWS_ACCESS_KEY_ID,
	secretAccessKey: AWS_SECRET_ACCESS_KEY,
});
export function uploadS3(req) {
	const form = formidable();
	console.log('form: ', form);
	return new Promise((resolve, reject) => {
		console.log('inside promise @@@@@@@');
		form.parse(req, (err, fields, files) => {
			console.log('inside form. parse@@@');
			if (err) {
				console.error(err);
				reject(err);
				// res.status(500).send('Internal Server Error');
				return;
			}

			const file = files['file'];
			const s3Key = `uploads/${file.originalFilename}`;
			const fileStream = file ? fs.createReadStream(file.filepath) : null;
			const params = {
				Bucket: S3_BUCKET_NAME,
				Key: s3Key,
				Body: fileStream,
				ContentType: 'application/pdf',
				ACL: 'public-read',
			};
			console.log('after params');
			try {
				//파일 업로드
				s3.upload(params, (err, result) => {
					if (err) {
						console.log('upload err: ', err);
						reject(err);
					}
					const fileUrl = result.Location;
					console.log('file url: ', fileUrl);
					resolve({ fileUrl, fields });
				});
				// res.status(200).json({ fileUrl });
			} catch (error) {
				console.error(error);
				// res.status(500).send('Internal Server Error');
				reject(error);
			}
		});
	});
}
