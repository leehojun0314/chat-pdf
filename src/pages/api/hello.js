// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { runCorsMiddleware } from '@/utils/middleware';

export default function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.status(200).json({ message: 'CORS enabled' });
}
