import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
export default function Chat() {
	const router = useRouter();
	const [chatInput, setChatInput] = useState('');
	const [chatInputInvalid, setChatInputInvalid] = useState(false);
	const [allMessages, setAllMessages] = useState([]);
	useEffect(() => {
		console.log('useEffect');
		if (router.query.convId) {
			axios
				.get(
					`${process.env.NEXT_PUBLIC_API_ENDPOINT}/message/v3?convId=${router.query.convId}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								'chatToken',
							)}`,
						},
					},
				)
				.then((response) => {
					console.log('response: ', response.data);
					const data = response.data;
					const newMessages = [];
					const questions = [];
					for (let question of data.questions) {
						questions.push(question.question_content);
					}
					const salutation = {
						message: `${data.conversation.salutation} \n ${questions.join(
							'\n',
						)}`,
					};
					newMessages.push(salutation);
					const oldMessages = data.messages;
					console.log('old messages:', oldMessages);

					console.log('new messages: ', newMessages);
					setAllMessages(newMessages.concat(oldMessages));
				})
				.catch((err) => {
					console.log(err);
					// router.push('/');
				});
		}
	}, [router]);
	function handleSubmit(event) {
		event.preventDefault();
		const temp = [...allMessages, { message: chatInput }, { message: '' }];
		setAllMessages(temp);
		//답변을 받고 있는 도중에 입력을 받을 수 없게 제한
		setChatInputInvalid(true);
		try {
			axios
				.post(
					`${process.env.NEXT_PUBLIC_API_ENDPOINT}/message/v3`,
					{ text: chatInput, conversationId: router.query.convId },
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								'chatToken',
							)}`,
						},
						onDownloadProgress: (progressEvent) => {
							const text = progressEvent.event.currentTarget.response;
							console.log('progress text: ', text);
							temp[temp.length - 1].message = text;
							setAllMessages([...temp]);
						},
					},
				)
				.then((response) => {
					console.log('response: ', response);
					// setAllMessages([...temp, { message: response.data }]);
					setChatInputInvalid(false);
				})
				.catch((err) => {
					console.log('err ; ', err.response);
					if (err.response.status === 401) {
						router.push('/');
					}
					setChatInputInvalid(false);
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
				readOnly={chatInputInvalid}
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
				.map((el, idx) => {
					return <Message key={idx} message={el.message} />;
				})}
		</div>
	);
}
const Message = React.memo(({ message }) => {
	return (
		<div
			style={{
				width: '100%',
			}}
		>
			{message}
			<hr></hr>
		</div>
	);
});
