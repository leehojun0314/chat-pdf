import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
	organization: 'org-FF6yTVLsIHFQDUD82Y7LoiQZ',
});
const OPENAI_ENGINE_ID = 'text-davinci-002';
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
	if (!configuration.apiKey) {
		res.status(500).json({
			error: {
				message:
					'OpenAI API key not configured, please follow instructions in README.md',
			},
		});
		return;
	}
	// const text = req.body.text || '';
	// console.log('text: ', text);
	const completion = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: [
			{
				role: 'user',
				content: `안녕?`,
			},
			{
				role: 'assistant',
				content:
					'안녕하세요! 반갑습니다! 저는 인공지능 챗봇입니다. 어떤 것을 도와드릴까요?',
			},
			{
				role: 'user',
				content: `아래 내용을 숙지하고, 나중에 내가 물어봤을때 답변해줘.
				생활관   관련   Q&A  1.   생활관   벌점상쇄는   
어떻게   해야하나요 ?  생활관   벌점상쇄는   상점활동을   통해   상쇄가능합니다 .   상점활동으로는   관생수칙   상벌  점표를   참고하시기   바랍니다 .   주요활동으로   선거   참여 ,   비교과   프로그램 ( 상점   부여   혜  택   제시된 )   이수 ,   벌점상쇄   청소봉사   등이   있습니다 .  2.   생활관비   환불을   받으려는데   어떻게    신청해야하나요 ?  신청   절차는   ‘ 생활관   홈페이지 - 커뮤니티 - 서식자료실 ’   메뉴에서   생활관   퇴사 ( 환 불 ) 신청  서   다운로드   후   작성하시어   납부증명서 ,   통장사본을   첨부하여   생활관   통합행정실로  직접   제출   또는   등기우편으로   보내시면   됩니다 .  [ 참고 ]   관생수칙에   근거하여   생활관비는   미입사시    전액   환불되고   중도퇴사시   잔여일수  30 일이상   일 때만   잔여기간에   대한   환불이   됩니다 .   중도퇴사   환불   내역은   관생수칙을  참고하시기   바랍니다 .  3.   생활관으로   택배를   받으려는데   주소를   어떻게   쓰면   될까요 ?  충북   괴산군   괴산읍   문무로   85   ( 남자   또는   여자 ) 생활관   ( 이하   본인   호실   기재 ) 하시면  됩니다 .  [ 참고 ]   택배   수령은   남자생활관은   1 동   2 층   택배실 ,   여자생활관은   6 동   2 층   택배실에서  수령하시면   됩니다 .( 추후   변경 가능 )  4.   점호는   어떻게   진행하나요 ?  매일   23  시   호실에서   층장학생들이   대면   점호를   실시합니 다 .   점호불참시   벌점   – 3 점   부  과됩니다 .  5.   외박신청은   어떻게   신청하나요 ?  통합정보시스템   로그인   후   ‘ 기숙사 - 외박신청 ’   메뉴에서   필수사항 ( 외박사유 ,   외박출발  일 ,   외박복귀일   등 )   입력하여   신청버튼   클릭하시면   됩니다 .  [ 참고 ]   외박당일   19 시까지   신청되며   외박횟수는   제한없고   1 회   4 일까지   가능합니다 .  단 ,   금 ~ 일요일 / 공휴 일   전일   및   공휴일은   외박신청   제외합니다 .   외박신청을   안할   경우  무단외박   벌점   – 3 점   부과 됩니다 .`,
			},
			{
				role: 'assistant',
				content:
					'알겠습니다! 나중에 이 내용들을 다시 물어보시면 답변해드리겠습니다.',
			},
			{
				role: 'user',
				content: `생활관비 환불은 어떻게해?`,
			},
		],
	});
	console.log(completion.data.choices[0].message);
	res.send({ data: 'testing' });
}
