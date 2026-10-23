import { Observable, OperatorFunction, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';

export function cache<T>(refCount: boolean = false) {
	return shareReplay<T>({ bufferSize: 1, refCount });
}

export function mySwitchMap<T, R>(
	project: (value: T) => Observable<R | null>,
	defValue: R
): OperatorFunction<T | null | undefined, R>;

export function mySwitchMap<T, R>(
	project: (value: T) => Observable<R | null>
): OperatorFunction<T | null | undefined, R | null>;

export function mySwitchMap<T, R>(project: (value: T) => Observable<R | null>, defValue?: R) {
	return switchMap<T | null | undefined, Observable<R | null>>(value =>
		value ? project(value) : of(defValue ?? null)
	);
}

export function myMap<T, R>(
	project: (value: T) => R | null,
	defValue: R
): OperatorFunction<T | null | undefined, R>;

export function myMap<T, R>(
	project: (value: T) => R | null
): OperatorFunction<T | null | undefined, R | null>;

export function myMap<T, R>(project: (value: T) => R | null, defValue?: R) {
	return map<T | null | undefined, R | null>(value => (value ? project(value) : (defValue ?? null)));
}
