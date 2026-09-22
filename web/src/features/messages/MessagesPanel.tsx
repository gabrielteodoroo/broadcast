import { useMemo, useState } from 'react';
import {
  Button,
  Chip,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import { useAuth } from '../auth/auth-context';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useContacts } from '../contacts/use-contacts';
import { useMessages } from './use-messages';
import { MessageFormDialog } from './MessageFormDialog';
import {
  createMessage,
  deleteMessage,
  updateMessage,
  type MessageInput,
} from '../../services/messages-service';
import type { Message } from '../../types';

type Filter = 'all' | 'sent' | 'scheduled';

const formatDate = (ms: number | null) =>
  ms ? dayjs(ms).format('DD/MM/YYYY HH:mm') : '—';

export const MessagesPanel = ({ connectionId }: { connectionId: string }) => {
  const { user } = useAuth();
  const { messages, loading } = useMessages(user?.uid, connectionId);
  const { contacts } = useContacts(user?.uid, connectionId);

  const [filter, setFilter] = useState<Filter>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Message | null>(null);
  const [removing, setRemoving] = useState<Message | null>(null);

  const contactNames = useMemo(
    () => new Map(contacts.map((c) => [c.id, c.name])),
    [contacts],
  );

  const visible = useMemo(
    () =>
      filter === 'all'
        ? messages
        : messages.filter((m) => m.status === filter),
    [messages, filter],
  );

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (message: Message) => {
    setEditing(message);
    setFormOpen(true);
  };

  const handleSubmit = async (input: MessageInput) => {
    if (!user) return;
    if (editing) await updateMessage(editing.id, input);
    else await createMessage(user.uid, connectionId, input);
  };

  const handleDelete = async () => {
    if (!removing) return;
    await deleteMessage(removing.id);
    setRemoving(null);
  };

  const describeRecipients = (message: Message) => {
    const names = message.contactIds.map(
      (id) => contactNames.get(id) ?? '(removido)',
    );
    if (names.length <= 2) return names.join(', ');
    return `${names.slice(0, 2).join(', ')} +${names.length - 2}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Typography variant="h6">Mensagens</Typography>
        <div className="flex items-center gap-2">
          <ToggleButtonGroup
            size="small"
            exclusive
            value={filter}
            onChange={(_, value: Filter | null) => value && setFilter(value)}
          >
            <ToggleButton value="all">Todas</ToggleButton>
            <ToggleButton value="sent">Enviadas</ToggleButton>
            <ToggleButton value="scheduled">Agendadas</ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
          >
            Nova
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <CircularProgress />
        </div>
      ) : visible.length === 0 ? (
        <Typography color="text.secondary">
          Nenhuma mensagem neste filtro.
        </Typography>
      ) : (
        <List className="rounded border border-gray-200">
          {visible.map((message) => (
            <ListItem
              key={message.id}
              divider
              alignItems="flex-start"
              secondaryAction={
                <span>
                  {message.status === 'scheduled' && (
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => openEdit(message)}
                      aria-label="Editar"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => setRemoving(message)}
                    aria-label="Excluir"
                    className="!ml-1"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </span>
              }
            >
              <ListItemText
                primary={
                  <span className="flex items-center gap-2 pr-16">
                    <Chip
                      size="small"
                      color={
                        message.status === 'sent' ? 'success' : 'warning'
                      }
                      label={
                        message.status === 'sent' ? 'Enviada' : 'Agendada'
                      }
                    />
                    <span className="truncate">{message.body}</span>
                  </span>
                }
                secondary={
                  <>
                    <span className="block">
                      Para: {describeRecipients(message)}
                    </span>
                    <span className="block">
                      {message.status === 'sent'
                        ? `Enviada em ${formatDate(message.sentAt)}`
                        : `Agendada para ${formatDate(message.scheduledAt)}`}
                    </span>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      <MessageFormDialog
        open={formOpen}
        message={editing}
        contacts={contacts}
        onSubmit={handleSubmit}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={Boolean(removing)}
        title="Excluir mensagem"
        description="Tem certeza que deseja excluir esta mensagem? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        onCancel={() => setRemoving(null)}
      />
    </div>
  );
};
