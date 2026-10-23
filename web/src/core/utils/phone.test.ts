import { formatPhone, phoneDigits } from 'core/utils/phone';

describe('phoneDigits', () => {
	it('remove tudo que não é dígito', () => {
		expect(phoneDigits('(11) 99999-8888')).toBe('11999998888');
	});

	it('corta em 11 dígitos', () => {
		expect(phoneDigits('119999988881234')).toBe('11999998888');
	});
});

describe('formatPhone', () => {
	it('formata celular com 9 dígitos', () => {
		expect(formatPhone('11999998888')).toBe('(11) 99999-8888');
	});

	it('formata fixo com 8 dígitos', () => {
		expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
	});

	it('formata parcialmente enquanto se digita', () => {
		expect(formatPhone('1')).toBe('(1');
		expect(formatPhone('119')).toBe('(11) 9');
		expect(formatPhone('')).toBe('');
	});
});
