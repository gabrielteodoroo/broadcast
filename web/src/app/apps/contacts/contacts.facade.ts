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

const formOpenAtom = atom(false);
const editingContactAtom = atom<ContactModel | null>(null);
const removingContactAtom = atom<ContactModel | null>(null);

interface UseContactsPanelProps {
	connectionId: string;
}

export function useContactsPanel(props: UseContactsPanelProps) {
	const { connectionId } = props;

	const user = useCurrentUser();
	const ownerId = getOwnerId(user);

	const { contacts, isLoading } = useContacts({ ownerId, connectionId });

	const formOpen = useAtomValue(formOpenAtom);
	const editing = useAtomValue(editingContactAtom);
	const removing = useAtomValue(removingContactAtom);

	const setFormOpen = useSetAtom(formOpenAtom);
	const setEditing = useSetAtom(editingContactAtom);
	const setRemoving = useSetAtom(removingContactAtom);

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

	async function confirmRemove() {
		if (!removing) return;

		await deleteContact(removing.id);
		setRemoving(null);
	}

	return {
		contacts,
		isLoading,
		formOpen,
		editing,
		removing,
		openCreate,
		openEdit,
		closeForm: () => setFormOpen(false),
		submit,
		validate,
		askRemove: setRemoving,
		cancelRemove: () => setRemoving(null),
		confirmRemove,
	};
}
