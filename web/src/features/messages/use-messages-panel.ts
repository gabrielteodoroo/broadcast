import { useMemo, useState } from 'react';
import { useAuth } from '../auth/auth-context';
import { useContacts } from '../contacts/use-contacts';
import { useMessages } from './use-messages';
import {
  createMessage,
  deleteMessage,
  updateMessage,
  type MessageInput,
} from '../../services/messages-service';
import type { Message } from '../../types';

export type MessageFilter = 'all' | 'sent' | 'scheduled';

export const useMessagesPanel = (connectionId: string) => {
  const { user } = useAuth();
  const { messages, loading } = useMessages(user?.uid, connectionId);
  const { contacts } = useContacts(user?.uid, connectionId);

  const [filter, setFilter] = useState<MessageFilter>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Message | null>(null);
  const [removing, setRemoving] = useState<Message | null>(null);

  const contactNames = useMemo(
    () => new Map(contacts.map((c) => [c.id, c.name])),
    [contacts],
  );

  const visible = useMemo(
    () =>
      filter === 'all' ? messages : messages.filter((m) => m.status === filter),
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

  const submit = async (input: MessageInput) => {
    if (!user) return;
    if (editing) await updateMessage(editing.id, input);
    else await createMessage(user.uid, connectionId, input);
  };

  const confirmRemove = async () => {
    if (!removing) return;
    await deleteMessage(removing.id);
    setRemoving(null);
  };

  const recipientsOf = (message: Message) => {
    const names = message.contactIds.map(
      (id) => contactNames.get(id) ?? '(removido)',
    );
    if (names.length <= 2) return names.join(', ');
    return `${names.slice(0, 2).join(', ')} +${names.length - 2}`;
  };

  return {
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
    closeForm: () => setFormOpen(false),
    submit,
    askRemove: setRemoving,
    cancelRemove: () => setRemoving(null),
    confirmRemove,
    recipientsOf,
  };
};
