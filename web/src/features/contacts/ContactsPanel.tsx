import {
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ContactFormDialog } from './ContactFormDialog';
import { useContactsPanel } from './use-contacts-panel';
import { formatPhone } from './phone';

export const ContactsPanel = ({ connectionId }: { connectionId: string }) => {
  const {
    contacts,
    loading,
    formOpen,
    editing,
    removing,
    openCreate,
    openEdit,
    closeForm,
    submit,
    validate,
    askRemove,
    cancelRemove,
    confirmRemove,
  } = useContactsPanel(connectionId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Typography variant="h6">Contatos</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Novo contato
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <CircularProgress />
        </div>
      ) : contacts.length === 0 ? (
        <Typography color="text.secondary">
          Nenhum contato nesta conexão.
        </Typography>
      ) : (
        <List className="rounded border border-gray-200">
          {contacts.map((contact) => (
            <ListItem
              key={contact.id}
              divider
              secondaryAction={
                <span>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => openEdit(contact)}
                    aria-label="Editar"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => askRemove(contact)}
                    aria-label="Excluir"
                    className="!ml-1"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </span>
              }
            >
              <ListItemText
                primary={contact.name}
                secondary={formatPhone(contact.phone)}
              />
            </ListItem>
          ))}
        </List>
      )}

      <ContactFormDialog
        open={formOpen}
        contact={editing}
        onSubmit={submit}
        onClose={closeForm}
        validate={validate}
      />

      <ConfirmDialog
        open={Boolean(removing)}
        title="Excluir contato"
        description={`Tem certeza que deseja excluir "${removing?.name}"? Esta ação não pode ser desfeita.`}
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
      />
    </div>
  );
};
