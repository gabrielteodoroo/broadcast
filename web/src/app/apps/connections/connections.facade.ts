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

const formOpenAtom = atom(false);
const editingConnectionAtom = atom<ConnectionModel | null>(null);
const removingConnectionAtom = atom<ConnectionModel | null>(null);

export function useConnectionsPage() {
	const user = useCurrentUser();
	const ownerId = getOwnerId(user);
	const navigate = useNavigate();

	const { connections, isLoading } = useConnections({ ownerId });

	const formOpen = useAtomValue(formOpenAtom);
	const editing = useAtomValue(editingConnectionAtom);
	const removing = useAtomValue(removingConnectionAtom);

	const setFormOpen = useSetAtom(formOpenAtom);
	const setEditing = useSetAtom(editingConnectionAtom);
	const setRemoving = useSetAtom(removingConnectionAtom);

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

	async function confirmRemove() {
		if (!removing) return;

		await deleteConnection(removing.id);
		setRemoving(null);
	}

	return {
		connections,
		isLoading,
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
		openDetail: (connection: ConnectionModel) => navigate(`/connections/${connection.id}`),
	};
}
