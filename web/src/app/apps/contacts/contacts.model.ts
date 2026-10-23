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
import { collectionData$ } from 'core/firebase/rxfire';

export interface ContactModel {
	id: string;
	name: string;
	phone: string;
	ownerId: string;
	connectionId: string;
	createdAt: Timestamp;
}

export interface ContactInput {
	name: string;
	phone: string;
}

const contactsCollection = collection<ContactModel>('contacts');

interface GetContactsProps {
	ownerId: string;
	connectionId: string;
}

export function getContacts$(props: GetContactsProps): Observable<ContactModel[]> {
	const { ownerId, connectionId } = props;

	return collectionData$<ContactModel>(
		query(
			contactsCollection,
			where('ownerId', '==', ownerId),
			where('connectionId', '==', connectionId),
			orderBy('createdAt', 'desc')
		)
	);
}

interface CreateContactProps {
	ownerId: string;
	connectionId: string;
	input: ContactInput;
}

export function createContact(props: CreateContactProps) {
	const { ownerId, connectionId, input } = props;

	return addDoc(
		contactsCollection,
		documentPayload<ContactModel>({
			ownerId,
			connectionId,
			name: input.name.trim(),
			phone: input.phone.trim(),
			createdAt: serverTimestamp(),
		})
	);
}

interface UpdateContactProps {
	contactId: string;
	input: ContactInput;
}

export function updateContact(props: UpdateContactProps) {
	const { contactId, input } = props;

	return updateDoc(doc(contactsCollection, contactId), {
		name: input.name.trim(),
		phone: input.phone.trim(),
	});
}

export function deleteContact(contactId: string) {
	return deleteDoc(doc(contactsCollection, contactId));
}
