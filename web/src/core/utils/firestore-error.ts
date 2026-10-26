import { FirestoreErrorCode } from 'firebase/firestore';

const MESSAGES: Partial<Record<FirestoreErrorCode, string>> = {
	'permission-denied': 'Você não tem permissão para esta ação.',
	unauthenticated: 'Sua sessão expirou. Entre novamente para continuar.',
	unavailable: 'Sem conexão com o servidor. Verifique sua internet e tente novamente.',
	'deadline-exceeded': 'O servidor demorou para responder. Tente novamente.',
	'not-found': 'Este registro não existe mais. Atualize a página.',
	'resource-exhausted': 'Limite de uso excedido. Tente novamente em alguns minutos.',
};

function errorCodeOf(error: unknown): string | null {
	if (typeof error !== 'object' || error === null) return null;

	const { code } = error as { code?: unknown };

	return typeof code === 'string' ? code : null;
}

export function messageFromFirestoreError(error: unknown, fallback: string): string {
	const code = errorCodeOf(error);

	if (!code) return fallback;

	return MESSAGES[code as FirestoreErrorCode] ?? fallback;
}
