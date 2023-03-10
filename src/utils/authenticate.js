import axios from 'axios';

export default function authenticate(req, res) {
	return new Promise((resolve, reject) => {
		const authorizationHeader = req.headers.authorization;
		const token = authorizationHeader?.split(' ')[1];

		if (!token) {
			res?.status(404).json({ data: 'UnAuthorized' });
			return reject({ data: 'UnAuthorized', status: false });
		} else {
			axios
				.get(`https://dtizen-secure.vercel.app/api/verify?jwt=${token}`)
				.then((response) => {
					resolve({ data: response.data, status: true });
				})
				.catch((err) => {
					res?.status(404).json({ data: 'UnAuthorized' });
					reject({ data: err, status: false });
				});
		}
	});
}
