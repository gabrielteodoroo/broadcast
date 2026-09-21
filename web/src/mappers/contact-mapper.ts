import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import type { Contact } from '../types';
import { toMillisOrNow } from './timestamp';

export const toContact = (
  snap: QueryDocumentSnapshot<DocumentData>,
): Contact => {
  const data = snap.data();
  return {
    id: snap.id,
    name: data.name ?? '',
    phone: data.phone ?? '',
    ownerId: data.ownerId,
    connectionId: data.connectionId,
    createdAt: toMillisOrNow(data.createdAt),
  };
};
