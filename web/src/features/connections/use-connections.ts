import { useEffect, useState } from 'react';
import { watchConnections } from '../../services/connections-service';
import type { Connection } from '../../types';

export const useConnections = (ownerId: string | undefined) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) return;
    setLoading(true);
    const unsubscribe = watchConnections(
      ownerId,
      (items) => {
        setConnections(items);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao carregar conexões:', error);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [ownerId]);

  return { connections, loading };
};
