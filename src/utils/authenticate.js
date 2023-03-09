import axios from 'axios';

export default function authenticate(req) {
	return new Promise((resolve, reject) => {
		const authorizationHeader = req.headers.authorization;
		const token = authorizationHeader?.split(' ')[1];

		if (!token) {
			return reject('UnAuthorized');
		} else {
			axios
				.get(`https://dtizen-secure.vercel.app/api/verify?jwt=${token}`)
				.then((response) => {
					resolve({ data: response.data, status: true });
				})
				.catch((err) => {
					reject({ data: err, status: false });
				});
		}
	});
}
