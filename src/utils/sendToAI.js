import { Configuration, OpenAIApi } from 'openai';
import { messageGenerator } from './generator';
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
	organization: 'org-FF6yTVLsIHFQDUD82Y7LoiQZ',
});
const openai = new OpenAIApi(configuration);
export default async function sendToAi(recordset, newMessage) {
	const messages = messageGenerator(recordset);
	if (!configuration.apiKey) {
		res.status(500).json({
			error: {
				message:
					'OpenAI API key not configured, please follow instructions in README.md',
			},
		});
		return;
	}
	messages.push({
		role: 'user',
		content: newMessage,
	});
	const completion = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: messages,
	});
	console.log(completion.data.choices[0].message);
	messages.push(completion.data.choices[0].message);
	return { messages: messages, answer: completion.data.choices[0].message };
}
