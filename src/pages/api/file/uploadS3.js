import { checkMethod, runCorsMiddleware } from '@/utils/middleware';
import { uploadS3 } from '@/utils/uploadS3';
import aws from 'aws-sdk';
import configs from '../../../../config/configs';

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req, res) {
	if (!checkMethod(req, res, ['POST'])) {
		return;
	}
	if (!runCorsMiddleware(req, res)) {
		return;
	}
	const { fileUrl } = await uploadS3(req);
	res.status(200).json({ fileUrl });
}
