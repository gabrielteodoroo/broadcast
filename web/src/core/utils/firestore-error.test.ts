import { messageFromFirestoreError } from 'core/utils/firestore-error';

const FALLBACK = 'Não foi possível salvar.';

describe('messageFromFirestoreError', () => {
	it('traduz código conhecido do Firestore', () => {
		expect(messageFromFirestoreError({ code: 'permission-denied' }, FALLBACK)).toBe(
			'Você não tem permissão para esta ação.'
		);
	});

	it('usa o fallback em código desconhecido', () => {
		expect(messageFromFirestoreError({ code: 'internal' }, FALLBACK)).toBe(FALLBACK);
	});

	it('usa o fallback em erro sem código', () => {
		expect(messageFromFirestoreError(new Error('boom'), FALLBACK)).toBe(FALLBACK);
		expect(messageFromFirestoreError(null, FALLBACK)).toBe(FALLBACK);
		expect(messageFromFirestoreError('boom', FALLBACK)).toBe(FALLBACK);
	});
});
