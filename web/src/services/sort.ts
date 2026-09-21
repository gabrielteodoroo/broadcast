type HasCreatedAt = { createdAt: number };

export const byCreatedAtDesc = (a: HasCreatedAt, b: HasCreatedAt) =>
  b.createdAt - a.createdAt;
