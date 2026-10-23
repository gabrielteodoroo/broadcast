import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { Observable } from 'rxjs';
import { createBehavior } from 'core/rxjs/create-behavior';
import { firebaseApp } from 'core/firebase/firebase';

export const firebaseAuth = getAuth(firebaseApp());

const authState$ = new Observable<User | null>(subscriber => {
	const unsubscribe = onAuthStateChanged(
		firebaseAuth,
		user => subscriber.next(user),
		error => subscriber.error(error)
	);

	return { unsubscribe };
});

export const currentUser$ = createBehavior<User | null>(authState$);
