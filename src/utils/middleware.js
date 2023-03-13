import configs from '../../config/configs';
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

export function setHeaders(req, res, methods) {
	console.log('req.method: ', req.method);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	if (!configs.allowedOrigins.includes(req.headers.origin)) {
		res.status(403).json({ error: 'Forbidden' });
		return false;
	} else {
		if (req.method === 'OPTIONS') {
			// Preflight 요청에 대한 응답
			res.status(200).send();
			return false;
		}
		if (![...methods].includes(req.method)) {
			res.status(405).end();
			return false;
		}
	}
	return true;
}
