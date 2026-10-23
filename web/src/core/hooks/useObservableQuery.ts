import { useEffect } from 'react';
import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query';
import { Observable, finalize, firstValueFrom, shareReplay } from 'rxjs';

const sharedStreams = new Map<string, Observable<unknown>>();

function getSharedStream<T>(streamKey: string, observableFactory: () => Observable<T>): Observable<T> {
	const existingStream = sharedStreams.get(streamKey);

	if (existingStream) {
		return existingStream as Observable<T>;
	}

	const stream: Observable<T> = observableFactory().pipe(
		finalize(() => {
			if (sharedStreams.get(streamKey) === stream) {
				sharedStreams.delete(streamKey);
			}
		}),
		shareReplay({ bufferSize: 1, refCount: true })
	);

	sharedStreams.set(streamKey, stream);

	return stream;
}

interface UseObservableQueryParams<T> {
	queryKey: QueryKey;
	observableFactory: () => Observable<T>;
	enabled?: boolean;
}

interface UseObservableQueryResult<T> {
	data: T | undefined;
	isLoading: boolean;
	error: Error | null;
}

export default function useObservableQuery<T>(
	params: UseObservableQueryParams<T>
): UseObservableQueryResult<T> {
	const { queryKey, observableFactory, enabled = true } = params;

	const queryClient = useQueryClient();
	const queryKeyHash = JSON.stringify(queryKey);

	useEffect(() => {
		if (!enabled) {
			return;
		}

		const subscription = getSharedStream(queryKeyHash, observableFactory).subscribe({
			next: value => queryClient.setQueryData(queryKey, value),
			error: error => {
				console.error('[useObservableQuery]', queryKeyHash, error);
				queryClient.invalidateQueries({ queryKey });
			},
		});

		return () => subscription.unsubscribe();
	}, [queryKeyHash, enabled]);

	const query = useQuery({
		queryKey,
		queryFn: () => firstValueFrom(getSharedStream(queryKeyHash, observableFactory)),
		enabled,
		staleTime: Infinity,
	});

	return {
		data: query.data,
		isLoading: enabled && query.isPending,
		error: query.error,
	};
}
