import {
  Timestamp,
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
import { toMessage } from '../mappers/message-mapper';
import { byCreatedAtDesc } from './sort';
import type { Message } from '../types';

const messagesRef = collection(db, 'messages');

export type MessageInput = {
  body: string;
  contactIds: string[];
  scheduledAt: number | null;
};

export const watchMessages = (
  ownerId: string,
  connectionId: string,
  onData: (items: Message[]) => void,
  onError?: (error: Error) => void,
) => {
  const q = query(
    messagesRef,
    where('ownerId', '==', ownerId),
    where('connectionId', '==', connectionId),
  );
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map(toMessage).sort(byCreatedAtDesc)),
    (error) => onError?.(error),
  );
};

export const createMessage = (
  ownerId: string,
  connectionId: string,
  input: MessageInput,
) => {
  const isScheduled =
    input.scheduledAt !== null && input.scheduledAt > Date.now();

  return addDoc(messagesRef, {
    ownerId,
    connectionId,
    body: input.body.trim(),
    contactIds: input.contactIds,
    status: isScheduled ? 'scheduled' : 'sent',
    scheduledAt: isScheduled ? Timestamp.fromMillis(input.scheduledAt!) : null,
    sentAt: isScheduled ? null : serverTimestamp(),
    createdAt: serverTimestamp(),
  });
};

export const updateMessage = (id: string, input: MessageInput) => {
  const isScheduled =
    input.scheduledAt !== null && input.scheduledAt > Date.now();

  return updateDoc(doc(db, 'messages', id), {
    body: input.body.trim(),
    contactIds: input.contactIds,
    status: isScheduled ? 'scheduled' : 'sent',
    scheduledAt: isScheduled ? Timestamp.fromMillis(input.scheduledAt!) : null,
    sentAt: isScheduled ? null : serverTimestamp(),
  });
};

export const deleteMessage = (id: string) =>
  deleteDoc(doc(db, 'messages', id));
