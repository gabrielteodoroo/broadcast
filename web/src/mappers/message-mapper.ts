import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import type { Message, MessageStatus } from '../types';
import { toMillis, toMillisOrNow } from './timestamp';

export const toMessage = (
  snap: QueryDocumentSnapshot<DocumentData>,
): Message => {
  const data = snap.data();
  return {
    id: snap.id,
    body: data.body ?? '',
    ownerId: data.ownerId,
    connectionId: data.connectionId,
    contactIds: Array.isArray(data.contactIds) ? data.contactIds : [],
    status: (data.status as MessageStatus) ?? 'sent',
    scheduledAt: toMillis(data.scheduledAt),
    sentAt: toMillis(data.sentAt),
    createdAt: toMillisOrNow(data.createdAt),
  };
};
