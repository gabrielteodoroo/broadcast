import { getConnection$ } from 'app/apps/connections/connections.model';
import useObservableQuery from 'core/hooks/useObservableQuery';

interface UseConnectionProps {
	connectionId: string | undefined;
}

export default function useConnection(props: UseConnectionProps) {
	const { connectionId } = props;

	const query = useObservableQuery({
		queryKey: ['connections', 'detail', connectionId],
		observableFactory: () => getConnection$({ connectionId: connectionId! }),
		enabled: !!connectionId,
	});

	return {
		connection: query.data ?? null,
		isLoading: query.isLoading,
		error: query.error,
	};
}
