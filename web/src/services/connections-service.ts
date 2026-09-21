import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toConnection } from '../mappers/connection-mapper';
import { byCreatedAtDesc } from './sort';
import type { Connection } from '../types';

const connectionsRef = collection(db, 'connections');

export const watchConnections = (
  ownerId: string,
  onData: (items: Connection[]) => void,
  onError?: (error: Error) => void,
) => {
  const q = query(connectionsRef, where('ownerId', '==', ownerId));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map(toConnection).sort(byCreatedAtDesc)),
    (error) => onError?.(error),
  );
};

export const createConnection = (ownerId: string, name: string) =>
  addDoc(connectionsRef, {
    ownerId,
    name: name.trim(),
    createdAt: serverTimestamp(),
  });

export const updateConnection = (id: string, name: string) =>
  updateDoc(doc(db, 'connections', id), { name: name.trim() });

export const deleteConnection = (id: string) =>
  deleteDoc(doc(db, 'connections', id));
