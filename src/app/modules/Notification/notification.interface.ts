import { Types } from 'mongoose';

export type TNotification = {
  title: string;
  message: string;
  status: 'unread' | 'read';
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
