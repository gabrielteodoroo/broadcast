import { BehaviorSubject, Observable } from 'rxjs';

export function createBehavior<T>(source$: Observable<T>): BehaviorSubject<T | undefined> {
	const observable = new BehaviorSubject<T | undefined>(undefined);

	source$.subscribe(observable);

	return observable;
}
