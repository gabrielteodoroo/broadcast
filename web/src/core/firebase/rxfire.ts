import {
	DocumentData,
	DocumentReference,
	DocumentSnapshot,
	Query,
	QuerySnapshot,
	onSnapshot,
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { firebaseDebug, firebaseDebugLog } from 'environment';

const docRefCountCache: Record<string, number> = {};
const collectionRefCountCache: Record<string, number> = {};

function countDocReads(docRef: DocumentReference<unknown>) {
	if (!firebaseDebug) return;

	const path = docRef.parent?.id || 'undefined';

	docRefCountCache[path] = (docRefCountCache[path] ?? 0) + 1;

	firebaseDebugLog('get doc$', path, docRefCountCache[path], '+1');
}

function countCollectionReads(query: Query<unknown>, length = 1) {
	if (!firebaseDebug) return;

	const path = (query as { _query?: { path?: { segments?: string[] } } })._query?.path?.segments?.join('/');

	const key = path || 'undefined';

	collectionRefCountCache[key] = (collectionRefCountCache[key] ?? 0) + (length || 1);

	firebaseDebugLog('get query$', key, collectionRefCountCache[key], `+${length || '+'}`);
}

function snapToData<T>(snapshot: DocumentSnapshot<T | DocumentData>): T | null {
	if (!snapshot.exists()) return null;

	const data = snapshot.data();

	(data as Record<string, unknown>).id = snapshot.id;

	return data as T;
}

export function docData$<T>(ref: DocumentReference<T | DocumentData>): Observable<T | null> {
	return new Observable<DocumentSnapshot<T | DocumentData>>(subscriber => {
		const unsubscribe = onSnapshot(ref, subscriber);
		return { unsubscribe };
	}).pipe(
		map(snap => {
			countDocReads(ref);

			return snapToData<T>(snap);
		})
	);
}

export function collectionData$<T>(query: Query<T | DocumentData>): Observable<T[]> {
	return new Observable<QuerySnapshot<T | DocumentData>>(subscriber => {
		const unsubscribe = onSnapshot(query, subscriber);
		return { unsubscribe };
	}).pipe(
		map(snapshot => {
			countCollectionReads(query, snapshot.docChanges().length);

			return snapshot.docs.map(snap => {
				const data = snap.data();

				(data as Record<string, unknown>).id = snap.id;

				return data as T;
			});
		})
	);
}
