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
	console.log('req: ', req.headers);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	const reqOrigin = req.headers.referer.slice(0, -1);
	console.log('allowed:', configs.allowedOrigins);
	console.log('req origin: ', reqOrigin);
	if (!configs.allowedOrigins.includes(reqOrigin)) {
		res.status(403).json({ error: 'Forbidden' });
		return false;
	} else {
		if (req.method === 'OPTIONS') {
			// Preflight 요청에 대한 응답
			console.log('log before 200');
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
