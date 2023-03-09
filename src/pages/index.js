import Head from 'next/head';
import { useState } from 'react';
import styles from '@/styles/index.module.css';
import Cookie from 'js-cookie';
import cookies from 'next-cookies';
import axios from 'axios';
import { useRouter } from 'next/router';
export default function Home({ userData, logined, conversations }) {
	const [conversationNameInput, setCNInput] = useState('');
	const router = useRouter();
	function onSubmit(event) {
		event.preventDefault();
		console.log('conversationName Input input: ', conversationNameInput);
		axios
			.post(
				'/api/chat/createConversation',
				{
					conversationName: conversationNameInput,
				},
				{
					headers: {
						Authorization: `Bearer ${Cookie.get('chatpdf_token')}`,
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
		window.location.href = `https://dtizen-secure.vercel.app?redirect=${process.env.NEXT_PUBLIC_API_ENDPOINT}/login`;
	}
	function handleConversationClick(idx) {
		return () => {
			router.push({
				pathname: '/chat',
				query: { convId: conversations[idx].conversation_id },
			});
		};
	}

	return (
		<div>
			<Head>
				<title>OpenAI Quickstart</title>
				<link rel='icon' href='/dog.png' />
			</Head>

			<main className={styles.main}>
				<img src='/dog.png' className={styles.icon} />
				<h3>Name my conversation</h3>
				<form onSubmit={onSubmit}>
					<input
						type='text'
						name='conversationName'
						placeholder='Enter a conversation name'
						value={conversationNameInput}
						onChange={(e) => setCNInput(e.target.value)}
					/>
					<input type='submit' value='Generate conversation' />
				</form>
				{!logined ? (
					<>
						<div>you need to login first</div>
						<button onClick={handleLogin}>login</button>
					</>
				) : (
					<div>you are logined as {userData?.userName}</div>
				)}
				<h4>My conversations: </h4>
				{conversations.map((conversation, idx) => {
					return (
						<div
							key={idx}
							style={{ cursor: 'pointer' }}
							onClick={handleConversationClick(idx)}
						>
							{conversation.conversation_name}
						</div>
					);
				})}
			</main>
		</div>
	);
}
Home.getInitialProps = async (ctx) => {
	const chatpdf_token = cookies(ctx).chatpdf_token;
	let userData;
	let logined = false;
	let conversations = [];
	try {
		if (chatpdf_token) {
			const verifyResponse = await axios.get(
				`https://dtizen-secure.vercel.app/api/verify?jwt=${chatpdf_token}`,
			);
			if (verifyResponse?.data) {
				const converResponse = await axios.get(
					`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/chat/getConversation`,
					{
						headers: {
							Authorization: `Bearer ${chatpdf_token}`,
						},
					},
				);
				userData = verifyResponse.data;
				logined = true;
				conversations = converResponse.data;
			}
		}
	} catch (error) {
		console.log('error: ', error);
	}
	return { userData, logined, conversations };
};
