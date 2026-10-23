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

export type MessageStatus = 'scheduled' | 'sent';

export interface MessageModel {
	id: string;
	body: string;
	ownerId: string;
	connectionId: string;
	contactIds: string[];
	status: MessageStatus;
	scheduledAt: Timestamp | null;
	sentAt: Timestamp | null;
	createdAt: Timestamp;
}

export interface MessageInput {
	body: string;
	contactIds: string[];
	scheduledAt: number | null;
}

const messagesCollection = collection<MessageModel>('messages');

export function resolveSchedule(scheduledAt: number | null, now: number = Date.now()) {
	const isScheduled = scheduledAt !== null && scheduledAt > now;

	return {
		isScheduled,
		status: (isScheduled ? 'scheduled' : 'sent') as MessageStatus,
		scheduledAt: isScheduled ? Timestamp.fromMillis(scheduledAt) : null,
	};
}

interface GetMessagesProps {
	ownerId: string;
	connectionId: string;
}

export function getMessages$(props: GetMessagesProps): Observable<MessageModel[]> {
	const { ownerId, connectionId } = props;

	return collectionData$<MessageModel>(
		query(
			messagesCollection,
			where('ownerId', '==', ownerId),
			where('connectionId', '==', connectionId),
			orderBy('createdAt', 'desc')
		)
	);
}

interface CreateMessageProps {
	ownerId: string;
	connectionId: string;
	input: MessageInput;
}

export function createMessage(props: CreateMessageProps) {
	const { ownerId, connectionId, input } = props;
	const schedule = resolveSchedule(input.scheduledAt);

	return addDoc(
		messagesCollection,
		documentPayload<MessageModel>({
			ownerId,
			connectionId,
			body: input.body.trim(),
			contactIds: input.contactIds,
			status: schedule.status,
			scheduledAt: schedule.scheduledAt,
			sentAt: schedule.isScheduled ? null : serverTimestamp(),
			createdAt: serverTimestamp(),
		})
	);
}

interface UpdateMessageProps {
	messageId: string;
	input: MessageInput;
}

export function updateMessage(props: UpdateMessageProps) {
	const { messageId, input } = props;
	const schedule = resolveSchedule(input.scheduledAt);

	return updateDoc(doc(messagesCollection, messageId), {
		body: input.body.trim(),
		contactIds: input.contactIds,
		status: schedule.status,
		scheduledAt: schedule.scheduledAt,
		sentAt: schedule.isScheduled ? null : serverTimestamp(),
	});
}

export function deleteMessage(messageId: string) {
	return deleteDoc(doc(messagesCollection, messageId));
}
