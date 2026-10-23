import { getConnections$ } from 'app/apps/connections/connections.model';
import useObservableQuery from 'core/hooks/useObservableQuery';

interface UseConnectionsProps {
	ownerId: string | undefined;
}

export default function useConnections(props: UseConnectionsProps) {
	const { ownerId } = props;

	const query = useObservableQuery({
		queryKey: ['connections', ownerId],
		observableFactory: () => getConnections$({ ownerId: ownerId! }),
		enabled: !!ownerId,
	});

	return {
		connections: query.data ?? [],
		isLoading: query.isLoading,
		error: query.error,
	};
}
