import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let firestore: ReturnType<typeof getFirestore> | null = null;

export function getDb() {
	if (firestore) return firestore;

	if (!getApps().length) {
		initializeApp();
	}

	firestore = getFirestore();

	return firestore;
}
