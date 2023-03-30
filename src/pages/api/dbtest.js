import { getSql } from '@/utils/cache';
import { setHeaders } from '@/utils/middleware';

export default async function handler(req, res) {
	const url =
		'https://jemixhomefileupload.s3.amazonaws.com/uploads/pbl_edu.pdf';

	res.send('hello');
}
