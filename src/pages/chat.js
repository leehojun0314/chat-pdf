import { useState } from 'react';

export default function Chat(props) {
	console.log('props:', props);
	const [chatInput, setChatInput] = useState('');
	const [AiMessages, setAiMessages] = useState([]);
	const [myMessages, setMyMessages] = useState([]);
	async function handleSubmit(event) {
		event.preventDefault();
		try {
			const response = await fetch('/api/chatAi', {
				method: 'POST',
				body: JSON.stringify({ text: chatInput }),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error ${response.status}`);
			}
			const data = await response.json();
			console.log('response: ', data);
			// setAiMessages([...AiMessages, data]);
		} catch (error) {
			console.error(error);
		}
		setMyMessages([...myMessages, chatInput]);

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
			{AiMessages.map((el) => {
				return <div>{el}</div>;
			})}
			{myMessages.map((el) => {
				return <div>{el}</div>;
			})}
		</div>
	);
}
