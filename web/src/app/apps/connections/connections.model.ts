import {
	Timestamp,
	addDoc,
	deleteDoc,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { collection, doc, documentPayload } from 'core/firebase/firestore';
import { collectionData$, docData$ } from 'core/firebase/rxfire';

export interface ConnectionModel {
	id: string;
	name: string;
	ownerId: string;
	createdAt: Timestamp;
}

const connectionsCollection = collection<ConnectionModel>('connections');

interface GetConnectionsProps {
	ownerId: string;
}

export function getConnections$(props: GetConnectionsProps): Observable<ConnectionModel[]> {
	const { ownerId } = props;

	return collectionData$<ConnectionModel>(
		query(connectionsCollection, where('ownerId', '==', ownerId), orderBy('createdAt', 'desc'))
	);
}

interface GetConnectionProps {
	connectionId: string;
}

export function getConnection$(props: GetConnectionProps): Observable<ConnectionModel | null> {
	const { connectionId } = props;

	return docData$<ConnectionModel>(doc(connectionsCollection, connectionId));
}

interface CreateConnectionProps {
	ownerId: string;
	name: string;
}

export function createConnection(props: CreateConnectionProps) {
	const { ownerId, name } = props;

	return addDoc(
		connectionsCollection,
		documentPayload<ConnectionModel>({
			ownerId,
			name: name.trim(),
			createdAt: serverTimestamp(),
		})
	);
}

interface UpdateConnectionProps {
	connectionId: string;
	name: string;
}

export function updateConnection(props: UpdateConnectionProps) {
	const { connectionId, name } = props;

	return updateDoc(doc(connectionsCollection, connectionId), { name: name.trim() });
}

export function deleteConnection(connectionId: string) {
	return deleteDoc(doc(connectionsCollection, connectionId));
}
