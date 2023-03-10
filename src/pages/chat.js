import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import cookies from 'next-cookies';
import axios from 'axios';
export default function Chat() {
	const router = useRouter();
	const [chatInput, setChatInput] = useState('');
	const [allMessages, setAllMessages] = useState([]);
	useEffect(() => {
		if (router.query.convId) {
			axios
				.get(
					`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/chat/getMessages?convId=${router.query.convId}`,
					{
						headers: {
							Authorization: `Bearer ${Cookie.get('chatpdf_token')}`,
						},
					},
				)
				.then((response) => {
					console.log('response: ', response.data);
					const messages = response.data;
					setAllMessages(messages);
				})
				.catch((err) => {
					router.push('/');
				});
		}
	}, []);
	function handleSubmit(event) {
		event.preventDefault();
		const temp = [...allMessages, { message: chatInput }];
		setAllMessages(temp);
		try {
			axios
				.post(
					`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/chatAi`,
					{ text: chatInput, conversationId: router.query.convId },
					{
						headers: {
							Authorization: `Bearer ${Cookie.get('chatpdf_token')}`,
						},
					},
				)
				.then((response) => {
					console.log('response: ', response);
					setAllMessages([...temp, { message: response.data.answer }]);
				})
				.catch((err) => {
					console.log('err ; ', err.response);
					if (err.response.status === 401) {
						router.push('/');
					}
				});

			// setAiMessages([...AiMessages, data]);
		} catch (error) {
			console.error(error);
		}

		setChatInput('');
	}
	return (
		<div>
			<input
				type={'text'}
				value={chatInput}
				onChange={(e) => setChatInput(e.target.value)}
			></input>
			<button type={'button'} onClick={handleSubmit}>
				send
			</button>
			{/* {AiMessages.map((el) => {
				return (
					<div
						style={{
							float: 'left',
							width: '100%',
							backgroundColor: 'red',
						}}
					>
						{el.message}
					</div>
				);
			})}
			{myMessages.map((el) => {
				return (
					<div
						style={{
							float: 'right',
							width: '100%',
							backgroundColor: 'blue',
						}}
					>
						{el.message}
					</div>
				);
			})} */}
			{allMessages
				.sort((a, b) => a.message_order - b.message_order)
				.map((el) => {
					return (
						<div
							style={{
								width: '100%',
							}}
						>
							{el.message}
							<hr></hr>
						</div>
					);
				})}
		</div>
	);
}
