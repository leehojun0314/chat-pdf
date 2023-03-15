import { getSql } from '@/utils/cache';
import { setHeaders } from '@/utils/middleware';

export default async function handler(req, res) {
	// if (!setHeaders(req, res, ['GET'])) {
	// 	return;
	// }

	const sql = await getSql();
	const result = await sql
		.request()
		.query(
			`SELECT * FROM UserTable WHERE user_email = 'lhj66601234@gmail.com'`,
		);
	console.log('result: ', result);
	// mssql.connect(sqlConfig, (err) => {
	// 	if (err) {
	// 		console.log('err: ', err);
	// 		res.status(500).send(err);
	// 	} else {
	// 		mssql.query`INSERT INTO login (a_token, a_name, a_email, a_profile, a_date) VALUES (${jwtToken}, ${userName}, ${userEmail}, ${imgUrl}, GETDATE())`
	// 			.then((result) => {
	// 				console.log('result: ', result);
	// 				res.redirect(redirect + '?jwt=' + jwtToken);
	// 			})
	// 			.catch((err) => {
	// 				console.log('catch err: ', err);
	// 				res.status(500).send(err);
	// 			});
	// 	}
	// });
	res.send('hello');
}
