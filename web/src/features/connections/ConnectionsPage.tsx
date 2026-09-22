import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../auth/auth-context';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useConnections } from './use-connections';
import { ConnectionFormDialog } from './ConnectionFormDialog';
import {
  createConnection,
  deleteConnection,
  updateConnection,
} from '../../services/connections-service';
import type { Connection } from '../../types';

export const ConnectionsPage = () => {
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

  const handleSubmit = async (name: string) => {
    if (!user) return;
    if (editing) await updateConnection(editing.id, name);
    else await createConnection(user.uid, name);
  };

  const handleDelete = async () => {
    if (!removing) return;
    await deleteConnection(removing.id);
    setRemoving(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Typography variant="h5">Conexões</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Nova conexão
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <CircularProgress />
        </div>
      ) : connections.length === 0 ? (
        <Typography color="text.secondary">
          Nenhuma conexão ainda. Crie a primeira.
        </Typography>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {connections.map((connection) => (
            <Card key={connection.id} className="relative">
              <CardActionArea
                onClick={() => navigate(`/connections/${connection.id}`)}
              >
                <CardContent>
                  <Typography variant="h6" className="pr-16">
                    {connection.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Abrir contatos e mensagens
                  </Typography>
                </CardContent>
              </CardActionArea>
              <div className="absolute right-2 top-2 flex">
                <IconButton
                  size="small"
                  onClick={() => openEdit(connection)}
                  aria-label="Editar"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setRemoving(connection)}
                  aria-label="Excluir"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConnectionFormDialog
        open={formOpen}
        connection={editing}
        onSubmit={handleSubmit}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={Boolean(removing)}
        title="Excluir conexão"
        description={`Tem certeza que deseja excluir "${removing?.name}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setRemoving(null)}
      />
    </div>
  );
};
