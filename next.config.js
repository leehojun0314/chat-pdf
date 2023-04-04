/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	headers: () => {
		return [
			{
				source: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/message/v3`,
				headers: [
					{ key: 'Content-Type', value: 'application/json' },
					{ key: 'Content-Length', value: '1024' },
				],
			},
		];
	},
};

module.exports = nextConfig;
