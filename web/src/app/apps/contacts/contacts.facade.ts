import { atom, useAtomValue, useSetAtom } from 'jotai';
import {
	ContactInput,
	ContactModel,
	createContact,
	deleteContact,
	updateContact,
} from 'app/apps/contacts/contacts.model';
import useContacts from 'app/apps/contacts/hooks/useContacts';
import { getOwnerId, useCurrentUser } from 'app/apps/auth/auth.model';
import { phoneDigits } from 'core/utils/phone';
import { messageFromFirestoreError } from 'core/utils/firestore-error';

const formOpenAtom = atom(false);
const editingContactAtom = atom<ContactModel | null>(null);
const removingContactAtom = atom<ContactModel | null>(null);
const removeErrorAtom = atom('');

interface UseContactsPanelProps {
	connectionId: string;
}

export function useContactsPanel(props: UseContactsPanelProps) {
	const { connectionId } = props;

	const user = useCurrentUser();
	const ownerId = getOwnerId(user);

	const { contacts, isLoading, error } = useContacts({ ownerId, connectionId });

	const formOpen = useAtomValue(formOpenAtom);
	const editing = useAtomValue(editingContactAtom);
	const removing = useAtomValue(removingContactAtom);
	const removeError = useAtomValue(removeErrorAtom);

	const setFormOpen = useSetAtom(formOpenAtom);
	const setEditing = useSetAtom(editingContactAtom);
	const setRemoving = useSetAtom(removingContactAtom);
	const setRemoveError = useSetAtom(removeErrorAtom);

	function openCreate() {
		setEditing(null);
		setFormOpen(true);
	}

	function openEdit(contact: ContactModel) {
		setEditing(contact);
		setFormOpen(true);
	}

	async function submit(input: ContactInput) {
		if (!ownerId) return;

		if (editing) {
			await updateContact({ contactId: editing.id, input });
			return;
		}

		await createContact({ ownerId, connectionId, input });
	}

	function validate(input: ContactInput): string | null {
		const digits = phoneDigits(input.phone);

		const duplicated = contacts.some(
			contact => contact.id !== editing?.id && phoneDigits(contact.phone) === digits
		);

		return duplicated ? 'Já existe um contato com esse telefone nesta conexão.' : null;
	}

	function askRemove(contact: ContactModel) {
		setRemoveError('');
		setRemoving(contact);
	}

	function cancelRemove() {
		setRemoveError('');
		setRemoving(null);
	}

	async function confirmRemove() {
		if (!removing) return;

		setRemoveError('');

		try {
			await deleteContact(removing.id);
			setRemoving(null);
		} catch (error) {
			setRemoveError(
				messageFromFirestoreError(error, 'Não foi possível excluir o contato. Tente novamente.')
			);
		}
	}

	return {
		contacts,
		isLoading,
		loadError: error,
		formOpen,
		editing,
		removing,
		removeError,
		openCreate,
		openEdit,
		closeForm: () => setFormOpen(false),
		submit,
		validate,
		askRemove,
		cancelRemove,
		confirmRemove,
	};
}
