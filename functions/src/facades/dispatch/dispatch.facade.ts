import { Timestamp } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { MESSAGES_COLLECTION } from 'models/message.model';
import { getDb } from 'firebase-firestore';
import environment from 'environment';

interface DispatchDueMessagesProps {
	now?: Timestamp;
	limit?: number;
}

export interface DispatchDueMessagesResult {
	dispatched: number;
}

export async function dispatchDueMessages(
	props: DispatchDueMessagesProps = {}
): Promise<DispatchDueMessagesResult> {
	const { now = Timestamp.now(), limit = environment.dispatchBatchLimit } = props;

	const db = getDb();

	const due = await db
		.collection(MESSAGES_COLLECTION)
		.where('status', '==', 'scheduled')
		.where('scheduledAt', '<=', now)
		.limit(limit)
		.get();

	if (due.empty) {
		logger.info('Nenhuma mensagem agendada vencida.');

		return { dispatched: 0 };
	}

	const batch = db.batch();

	due.docs.forEach(doc => {
		batch.update(doc.ref, { status: 'sent', sentAt: now });
	});

	await batch.commit();

	logger.info(`Mensagens promovidas para enviada: ${due.size}`);

	return { dispatched: due.size };
}
