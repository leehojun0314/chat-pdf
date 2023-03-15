// server.js
const express = require('express');
const next = require('next');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const allowedDomains = [
	'http://localhost:3000',
	'http://localhost:3001',
	'http://127.0.0.1:3000',
	'http://metaschool.dtizen.com',
	'https://dtizen.net',
	'http://onnl.net',
];

const corsOptions = {
	origin: function (origin, callback) {
		console.log('origin: ', origin);
		if (allowedDomains.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
};

app.prepare()
	.then(() => {
		const server = express();

		// CORS 설정 적용
		server.use(cors(corsOptions));

		server.all('*', (req, res) => {
			return handle(req, res);
		});

		server.listen(3000, (err) => {
			if (err) throw err;
			console.log('> Ready on http://localhost:3000');
		});
	})
	.catch((ex) => {
		console.error(ex.stack);
		process.exit(1);
	});
