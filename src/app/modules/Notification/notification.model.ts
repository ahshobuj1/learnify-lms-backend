import mongoose, { Model, Schema } from 'mongoose';
import { TNotification } from './notification.interface';

const notificationSchema = new Schema<TNotification>(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['unread', 'read'], // Enforce specific values
      default: 'unread',
    },
    userId: {
      type: Schema.Types.ObjectId, // Use ObjectId
      ref: 'User', // Reference the User model
      required: true,
    },
  },
  { timestamps: true },
);

export const NotificationModel: Model<TNotification> =
  mongoose.model<TNotification>('Notification', notificationSchema);
