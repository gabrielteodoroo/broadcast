import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/auth-context';
import { useConnections } from './use-connections';
import {
  createConnection,
  deleteConnection,
  updateConnection,
} from '../../services/connections-service';
import type { Connection } from '../../types';

export const useConnectionsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { connections, loading } = useConnections(user?.uid);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Connection | null>(null);
  const [removing, setRemoving] = useState<Connection | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (connection: Connection) => {
    setEditing(connection);
    setFormOpen(true);
  };

  const submit = async (name: string) => {
    if (!user) return;
    if (editing) await updateConnection(editing.id, name);
    else await createConnection(user.uid, name);
  };

  const confirmRemove = async () => {
    if (!removing) return;
    await deleteConnection(removing.id);
    setRemoving(null);
  };

  const openDetail = (connection: Connection) =>
    navigate(`/connections/${connection.id}`);

  return {
    connections,
    loading,
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
    openDetail,
  };
};
