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
import { toContact } from '../mappers/contact-mapper';
import { byCreatedAtDesc } from './sort';
import type { Contact } from '../types';

const contactsRef = collection(db, 'contacts');

export type ContactInput = {
  name: string;
  phone: string;
};

export const watchContacts = (
  ownerId: string,
  connectionId: string,
  onData: (items: Contact[]) => void,
  onError?: (error: Error) => void,
) => {
  const q = query(
    contactsRef,
    where('ownerId', '==', ownerId),
    where('connectionId', '==', connectionId),
  );
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map(toContact).sort(byCreatedAtDesc)),
    (error) => onError?.(error),
  );
};

export const createContact = (
  ownerId: string,
  connectionId: string,
  input: ContactInput,
) =>
  addDoc(contactsRef, {
    ownerId,
    connectionId,
    name: input.name.trim(),
    phone: input.phone.trim(),
    createdAt: serverTimestamp(),
  });

export const updateContact = (id: string, input: ContactInput) =>
  updateDoc(doc(db, 'contacts', id), {
    name: input.name.trim(),
    phone: input.phone.trim(),
  });

export const deleteContact = (id: string) =>
  deleteDoc(doc(db, 'contacts', id));
