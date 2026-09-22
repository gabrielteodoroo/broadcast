import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions';
import { auth } from 'firebase-functions/v1';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

initializeApp();

const db = getFirestore();

const BATCH_LIMIT = 500;

export const createOwnerOnRegister = auth.user().onCreate(async (user) => {
  await db.collection('owners').doc(user.uid).set({
    name: user.displayName ?? '',
    email: user.email ?? '',
    createdAt: Timestamp.now(),
  });

  logger.info(`Owner criado para ${user.uid}`);
});

export const dispatchScheduledMessages = onSchedule(
  {
    schedule: 'every 1 minutes',
    timeZone: 'America/Sao_Paulo',
  },
  async () => {
    const now = Timestamp.now();

    const due = await db
      .collection('messages')
      .where('status', '==', 'scheduled')
      .where('scheduledAt', '<=', now)
      .limit(BATCH_LIMIT)
      .get();

    if (due.empty) {
      logger.info('Nenhuma mensagem agendada vencida.');
      return;
    }

    const batch = db.batch();
    due.docs.forEach((doc) => {
      batch.update(doc.ref, { status: 'sent', sentAt: now });
    });
    await batch.commit();

    logger.info(`Mensagens promovidas para enviada: ${due.size}`);
  },
);
