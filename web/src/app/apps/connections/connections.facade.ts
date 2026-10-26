import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import {
	ConnectionModel,
	createConnection,
	deleteConnection,
	updateConnection,
} from 'app/apps/connections/connections.model';
import useConnections from 'app/apps/connections/hooks/useConnections';
import { getOwnerId, useCurrentUser } from 'app/apps/auth/auth.model';
import { messageFromFirestoreError } from 'core/utils/firestore-error';

const formOpenAtom = atom(false);
const editingConnectionAtom = atom<ConnectionModel | null>(null);
const removingConnectionAtom = atom<ConnectionModel | null>(null);
const removeErrorAtom = atom('');

export function useConnectionsPage() {
	const user = useCurrentUser();
	const ownerId = getOwnerId(user);
	const navigate = useNavigate();

	const { connections, isLoading, error } = useConnections({ ownerId });

	const formOpen = useAtomValue(formOpenAtom);
	const editing = useAtomValue(editingConnectionAtom);
	const removing = useAtomValue(removingConnectionAtom);
	const removeError = useAtomValue(removeErrorAtom);

	const setFormOpen = useSetAtom(formOpenAtom);
	const setEditing = useSetAtom(editingConnectionAtom);
	const setRemoving = useSetAtom(removingConnectionAtom);
	const setRemoveError = useSetAtom(removeErrorAtom);

	function openCreate() {
		setEditing(null);
		setFormOpen(true);
	}

	function openEdit(connection: ConnectionModel) {
		setEditing(connection);
		setFormOpen(true);
	}

	async function submit(name: string) {
		if (!ownerId) return;

		if (editing) {
			await updateConnection({ connectionId: editing.id, name });
			return;
		}

		await createConnection({ ownerId, name });
	}

	function askRemove(connection: ConnectionModel) {
		setRemoveError('');
		setRemoving(connection);
	}

	function cancelRemove() {
		setRemoveError('');
		setRemoving(null);
	}

	async function confirmRemove() {
		if (!removing) return;

		setRemoveError('');

		try {
			await deleteConnection(removing.id);
			setRemoving(null);
		} catch (error) {
			setRemoveError(
				messageFromFirestoreError(error, 'Não foi possível excluir a conexão. Tente novamente.')
			);
		}
	}

	return {
		connections,
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
		askRemove,
		cancelRemove,
		confirmRemove,
		openDetail: (connection: ConnectionModel) => navigate(`/connections/${connection.id}`),
	};
}
