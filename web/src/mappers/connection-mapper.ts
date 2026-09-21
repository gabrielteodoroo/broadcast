import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import type { Connection } from '../types';
import { toMillisOrNow } from './timestamp';

export const toConnection = (
  snap: QueryDocumentSnapshot<DocumentData>,
): Connection => {
  const data = snap.data();
  return {
    id: snap.id,
    name: data.name ?? '',
    ownerId: data.ownerId,
    createdAt: toMillisOrNow(data.createdAt),
  };
};
