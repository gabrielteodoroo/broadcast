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
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { MessageFormDialog } from './MessageFormDialog';
import { useMessagesPanel, type MessageFilter } from './use-messages-panel';

const formatDate = (ms: number | null) =>
  ms ? dayjs(ms).format('DD/MM/YYYY HH:mm') : '—';

export const MessagesPanel = ({ connectionId }: { connectionId: string }) => {
  const {
    contacts,
    loading,
    visible,
    filter,
    setFilter,
    formOpen,
    editing,
    removing,
    openCreate,
    openEdit,
    closeForm,
    submit,
    askRemove,
    cancelRemove,
    confirmRemove,
    recipientsOf,
  } = useMessagesPanel(connectionId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Typography variant="h6">Mensagens</Typography>
        <div className="flex items-center gap-2">
          <ToggleButtonGroup
            size="small"
            exclusive
            value={filter}
            onChange={(_, value: MessageFilter | null) =>
              value && setFilter(value)
            }
          >
            <ToggleButton value="all">Todas</ToggleButton>
            <ToggleButton value="sent">Enviadas</ToggleButton>
            <ToggleButton value="scheduled">Agendadas</ToggleButton>
          </ToggleButtonGroup>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
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
                    onClick={() => askRemove(message)}
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
                      color={message.status === 'sent' ? 'success' : 'warning'}
                      label={message.status === 'sent' ? 'Enviada' : 'Agendada'}
                    />
                    <span className="truncate">{message.body}</span>
                  </span>
                }
                secondary={
                  <>
                    <span className="block">
                      Para: {recipientsOf(message)}
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
        onSubmit={submit}
        onClose={closeForm}
      />

      <ConfirmDialog
        open={Boolean(removing)}
        title="Excluir mensagem"
        description="Tem certeza que deseja excluir esta mensagem? Esta ação não pode ser desfeita."
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
      />
    </div>
  );
};
