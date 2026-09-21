export type Connection = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: number;
};

export type Contact = {
  id: string;
  name: string;
  phone: string;
  ownerId: string;
  connectionId: string;
  createdAt: number;
};

export type MessageStatus = 'scheduled' | 'sent';

export type Message = {
  id: string;
  body: string;
  ownerId: string;
  connectionId: string;
  contactIds: string[];
  status: MessageStatus;
  scheduledAt: number | null;
  sentAt: number | null;
  createdAt: number;
};
