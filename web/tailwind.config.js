/** @type {import('tailwindcss').Config} */
export default {
  // Evita conflito de reset com o Material UI: sem preflight.
  corePlugins: { preflight: false },
  important: '#root',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
