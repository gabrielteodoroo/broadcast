import { useEffect, useState } from 'react';
import { watchMessages } from '../../services/messages-service';
import type { Message } from '../../types';

export const useMessages = (
  ownerId: string | undefined,
  connectionId: string | undefined,
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId || !connectionId) return;
    setLoading(true);
    const unsubscribe = watchMessages(
      ownerId,
      connectionId,
      (items) => {
        setMessages(items);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao carregar mensagens:', error);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [ownerId, connectionId]);

  return { messages, loading };
};
