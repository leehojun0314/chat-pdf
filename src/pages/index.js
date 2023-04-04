import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '@/styles/index.module.css';
import Cookie from 'js-cookie';
import cookies from 'next-cookies';
import axios from 'axios';
import { useRouter } from 'next/router';
import configs from '../../config/configs';
export default function Home() {
	const [userData, setUserData] = useState(null);
	const [logined, setLogined] = useState(false);
	const [conversationNameInput, setCNInput] = useState('');
	const [conversations, setConversations] = useState([]);
	const [file, setFile] = useState(null);
	const router = useRouter();
	useEffect(() => {
		const chatpdf_token = localStorage.getItem('chatToken');
		if (chatpdf_token) {
			axios
				.get(`${configs.authenticateUrl}/api/verify?jwt=${chatpdf_token}`)
				.then((response) => {
					console.log('verify response: ', response.data);
					axios
						.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/conversation`, {
							headers: {
								Authorization: `Bearer ${chatpdf_token}`,
							},
						})
						.then((converResponse) => {
							console.log('converResponse: ', converResponse);
							setUserData(response.data);
							setLogined(true);
							setConversations(converResponse.data);
						})
						.catch((err) => {
							console.log('err: ', err);
						});
				})
				.catch((err) => {
					console.log('err: ', err);
				});
		}
	}, []);
	useEffect(() => {
		console.log('file: ', file);
	}, [file]);
	function onSubmit(event) {
		event.preventDefault();
		console.log('conversationName Input input: ', conversationNameInput);
		const formData = new FormData();
		formData.append('file', file);
		formData.append('conversationName', conversationNameInput);
		axios
			.post(
				`${process.env.NEXT_PUBLIC_API_ENDPOINT}/conversation/v3`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('chatToken')}`,
					},
				},
			)
			.then((response) => {
				console.log('response: ', response);
				setConversations(response.data.conversations);
			})
			.catch((err) => {
				console.log('err: ', err);
			});
	}
	function handleLogin(event) {
		event.preventDefault();
		window.location.href = `${configs.authenticateUrl}?redirect=${window.location.origin}/login`;
	}
	function handleConversationClick(idx) {
		return () => {
			router.push({
				pathname: '/chat',
				query: { convId: conversations[idx].conversation_id },
			});
		};
	}
	function handleFileChange(event) {
		const input = event.target;
		const file = input.files[0];
		const allowedExtensions = /(\.pdf|\.hwp)$/i;

		if (!allowedExtensions.exec(file.name)) {
			alert('PDF 파일만 선택 가능합니다.');
			input.value = '';
			setFile(null);
			return false;
		} else {
			setFile(event.target.files[0]);
		}
	}
	function handleDelete(convId) {
		return (event) => {
			axios
				.delete(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/conversation`)
				.then((response) => {
					console.log('response: ', response);
				})
				.catch((err) => {
					console.log(err);
				});
		};
	}
	// function handleTest() {
	// 	axios
	// 		.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/message/v3?convId=${conversation}`, {
	// 			headers: {
	// 				Authorization: `Bearer ${localStorage.getItem('chatToken')}`,
	// 			},

	// 		})
	// 		.then((response) => {
	// 			console.log('response: ', response);
	// 		})
	// 		.catch((err) => {
	// 			console.log('err: ', err);
	// 		});
	// }
	return (
		<div>
			<Head>
				<title>OpenAI Quickstart</title>
				<link rel='icon' href='/dog.png' />
			</Head>
			{/* <div>
				<button onClick={handleTest}>test</button>
			</div> */}
			{logined ? (
				<main className={styles.main}>
					<div>you are logined as {userData?.userName}</div>
					<img src='/dog.png' className={styles.icon} />
					<h3>Name my conversation</h3>
					<form onSubmit={onSubmit}>
						<input
							type='text'
							name='conversationName'
							placeholder='Enter a conversation name'
							value={conversationNameInput}
							onChange={(e) => setCNInput(e.target.value)}
							style={{ color: 'red' }}
						/>
						학습시킬 pdf파일을 선택하세요:
						<input
							type='file'
							onChange={handleFileChange}
							accept='.pdf, .hwp'
						/>
						<button
							type='submit'
							value='Generate conversation'
							disabled={!file}
						>
							생성하기
						</button>
					</form>

					<h4>My conversations: </h4>
					{conversations.map((conversation, idx) => {
						return (
							<div
								key={idx}
								style={{ cursor: 'pointer' }}
								onClick={handleConversationClick(idx)}
							>
								{conversation.conversation_name}
								<button
									onClick={handleDelete(conversation.conversation_id)}
								>
									삭제
								</button>
							</div>
						);
					})}
				</main>
			) : (
				<>
					<div>you need to login first</div>
					<button onClick={handleLogin}>login</button>
				</>
			)}
		</div>
	);
}
// Home.getInitialProps = async (ctx) => {
// 	// const chatpdf_token = cookies(ctx).chatpdf_token;
// 	const chatpdf_token = localStorage.getItem('chatToken');
// 	let userData;
// 	let logined = false;
// 	let conversations = [];
// 	try {
// 		if (chatpdf_token) {
// 			const verifyResponse = await axios.get(
// 				`https://dtizen-secure.vercel.app/api/verify?jwt=${chatpdf_token}`,
// 			);
// 			if (verifyResponse?.data) {
// 				const converResponse = await axios.get(
// 					`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/chat/getConversation`,
// 					{
// 						headers: {
// 							Authorization: `Bearer ${chatpdf_token}`,
// 						},
// 					},
// 				);
// 				userData = verifyResponse.data;
// 				logined = true;
// 				conversations = converResponse.data;
// 			}
// 		}
// 	} catch (error) {
// 		console.log('error: ', error);
// 	}
// 	return { userData, logined, conversations };
// };
