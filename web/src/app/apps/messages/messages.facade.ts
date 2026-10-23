import { useMemo } from 'react';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import {
	MessageInput,
	MessageModel,
	MessageStatus,
	createMessage,
	deleteMessage,
	updateMessage,
} from 'app/apps/messages/messages.model';
import useMessages from 'app/apps/messages/hooks/useMessages';
import useContacts from 'app/apps/contacts/hooks/useContacts';
import { getOwnerId, useCurrentUser } from 'app/apps/auth/auth.model';

export type MessageFilter = 'all' | MessageStatus;

export const messageFilterAtom = atom<MessageFilter>('all');

const formOpenAtom = atom(false);
const editingMessageAtom = atom<MessageModel | null>(null);
const removingMessageAtom = atom<MessageModel | null>(null);

const VISIBLE_RECIPIENTS = 2;

interface UseMessagesPanelProps {
	connectionId: string;
}

export function useMessagesPanel(props: UseMessagesPanelProps) {
	const { connectionId } = props;

	const user = useCurrentUser();
	const ownerId = getOwnerId(user);

	const { messages, isLoading } = useMessages({ ownerId, connectionId });

	const { contacts } = useContacts({ ownerId, connectionId });

	const filter = useAtomValue(messageFilterAtom);
	const formOpen = useAtomValue(formOpenAtom);
	const editing = useAtomValue(editingMessageAtom);
	const removing = useAtomValue(removingMessageAtom);

	const setFilter = useSetAtom(messageFilterAtom);
	const setFormOpen = useSetAtom(formOpenAtom);
	const setEditing = useSetAtom(editingMessageAtom);
	const setRemoving = useSetAtom(removingMessageAtom);

	const contactNames = useMemo(
		() => new Map(contacts.map(contact => [contact.id, contact.name])),
		[contacts]
	);

	const visible = useMemo(
		() => (filter === 'all' ? messages : messages.filter(message => message.status === filter)),
		[messages, filter]
	);

	function openCreate() {
		setEditing(null);
		setFormOpen(true);
	}

	function openEdit(message: MessageModel) {
		setEditing(message);
		setFormOpen(true);
	}

	async function submit(input: MessageInput) {
		if (!ownerId) return;

		if (editing) {
			await updateMessage({ messageId: editing.id, input });
			return;
		}

		await createMessage({ ownerId, connectionId, input });
	}

	async function confirmRemove() {
		if (!removing) return;

		await deleteMessage(removing.id);
		setRemoving(null);
	}

	function recipientsOf(message: MessageModel) {
		const names = message.contactIds.map(id => contactNames.get(id) ?? '(removido)');

		if (names.length <= VISIBLE_RECIPIENTS) return names.join(', ');

		return `${names.slice(0, VISIBLE_RECIPIENTS).join(', ')} +${names.length - VISIBLE_RECIPIENTS}`;
	}

	return {
		contacts,
		isLoading,
		visible,
		filter,
		setFilter,
		formOpen,
		editing,
		removing,
		openCreate,
		openEdit,
		closeForm: () => setFormOpen(false),
		submit,
		askRemove: setRemoving,
		cancelRemove: () => setRemoving(null),
		confirmRemove,
		recipientsOf,
	};
}
