/** @type {import('tailwindcss').Config} */
module.exports = {
	corePlugins: { preflight: false },
	important: '#root',
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: { extend: {} },
	plugins: [],
};
