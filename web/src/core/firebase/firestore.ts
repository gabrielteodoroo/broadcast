import {
	CollectionReference,
	DocumentData,
	DocumentReference,
	WithFieldValue,
	collection as fireCollection,
	doc as fireDoc,
	getFirestore,
} from 'firebase/firestore';
import { firebaseApp } from 'core/firebase/firebase';

export const firestore = getFirestore(firebaseApp());

export function collection<T = DocumentData>(path: string, ...pathSegments: string[]) {
	return fireCollection(firestore, path, ...pathSegments) as CollectionReference<T>;
}

export function doc<T = DocumentData>(reference: CollectionReference<T>, path: string) {
	return fireDoc(reference, path) as DocumentReference<T>;
}

export function documentPayload<T>(data: WithFieldValue<Omit<T, 'id'>>) {
	return data as WithFieldValue<T>;
}
