import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

export default function useObservable<T>(
	observable: () => Observable<T>,
	deps: unknown[],
	initialState: T
): T;

export default function useObservable<T>(
	observable: () => Observable<T>,
	deps: unknown[],
	initialState?: T
): T | undefined;

export default function useObservable<T>(
	observable: () => Observable<T>,
	deps: unknown[] = [],
	initialState?: T
): T | undefined {
	const [state, setState] = useState(initialState);

	useEffect(() => {
		const satisfy = deps.every(it => !!it);

		if (!satisfy) return;

		const subscription = observable().subscribe(setState);

		return () => {
			subscription.unsubscribe();
			setState(initialState);
		};
	}, deps);

	return state;
}
