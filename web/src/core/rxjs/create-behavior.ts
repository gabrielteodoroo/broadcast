import { BehaviorSubject, Observable } from 'rxjs';

export function createBehavior<T>(source$: Observable<T>): BehaviorSubject<T | undefined>;
export function createBehavior<T>(source$: Observable<T>, initialValue: T): BehaviorSubject<T>;

export function createBehavior<T>(source$: Observable<T>, initialValue?: T): BehaviorSubject<T | undefined> {
	const observable = new BehaviorSubject<T | undefined>(initialValue);

	source$.subscribe(observable);

	return observable;
}
