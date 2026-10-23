import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
} from 'firebase/auth';
import { currentUser$, firebaseAuth } from 'core/firebase/auth';
import useBehavior from 'core/hooks/useBehavior';

export function useCurrentUser() {
	return useBehavior(currentUser$);
}

export function getOwnerId(user: { uid: string } | null | undefined) {
	return user?.uid;
}

interface SignInProps {
	email: string;
	password: string;
}

export function signIn(props: SignInProps) {
	const { email, password } = props;

	return signInWithEmailAndPassword(firebaseAuth, email, password);
}

interface RegisterProps {
	name: string;
	email: string;
	password: string;
}

export async function register(props: RegisterProps) {
	const { name, email, password } = props;

	const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

	await updateProfile(credential.user, { displayName: name.trim() });

	return credential;
}

export function logout() {
	return signOut(firebaseAuth);
}
