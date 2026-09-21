import { Timestamp } from 'firebase/firestore';

export const toMillis = (value: unknown): number | null => {
  if (value instanceof Timestamp) return value.toMillis();
  return null;
};

export const toMillisOrNow = (value: unknown): number => toMillis(value) ?? Date.now();
