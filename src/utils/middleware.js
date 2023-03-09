import Cors from 'cors';
const corsOptions = {
	origin: ['localhost:3000'],
};
const corsMiddleware = Cors(corsOptions);
export function allowCors(handler) {
	return (req, res) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
		res.setHeader(
			'Access-Control-Allow-Headers',
			'X-Requested-With,content-type',
		);
		return handler(req, res);
	};
}

export function runMiddleware(req, res, fn) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result);
			}
			return resolve(result);
		});
	});
}
export function runCorsMiddleware(req, res) {
	let final;
	corsMiddleware(req, res, (result) => {
		if (result instanceof Error) {
			res.status(403).json({ message: 'CORS 오류가 발생했습니다.' });
			final = false;
		}
		final = true;
	});
	return final;
}
export function checkMethod(req, res, methods) {
	if (!methods.includes(req.method)) {
		res.setHeader('Allow', methods);
		res.status(405).end(); // Method Not Allowed
		return false;
	}
	return true;
}
