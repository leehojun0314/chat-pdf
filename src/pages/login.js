import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
export default function Login() {
	const router = useRouter();
	const token = router.query.jwt;
	useEffect(() => {
		if (process.browser) {
			console.log('page loaded');
			console.log('token: ', router.query.jwt);
			if (token) {
				Cookies.set('chatpdf_token', token, { expires: 1 });
				router.push('/');
			}
		}
	}, [router]);
	return <div>hello{token}</div>;
}
