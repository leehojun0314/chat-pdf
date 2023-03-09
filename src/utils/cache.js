let cachedResult;
const sql = require('mssql');

import configs from '../../config/configs';
const sqlConnectionPool = new sql.ConnectionPool({
	...configs.db,
	pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 30000,
	},
});
export async function getSql() {
	return await sqlConnectionPool.connect();
}
export function getResult() {
	if (!cachedResult) {
		// 결과를 계산하고 캐시
		cachedResult = calculateResult();
	}
	return cachedResult;
}

function calculateResult() {
	// 한 번만 실행할 함수
	console.log('calculateResult 함수가 실행되었습니다.');
	return '결과 값';
}
