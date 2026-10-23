import { Timestamp } from 'firebase-admin/firestore';

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

export const MESSAGES_COLLECTION = 'messages';
