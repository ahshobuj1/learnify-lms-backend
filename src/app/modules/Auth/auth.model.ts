import { model, Schema } from 'mongoose';
import { TUser } from './auth.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser>(
  {
    email: { type: String, unique: true },
    password: { type: String, select: 0 },
    avatar: { type: String },
    needPasswordChange: { type: Boolean, default: true },
    role: { type: String, enum: ['user', 'admin'] },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// create pre middlewares before save data
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  user.password = await bcrypt.hash(
    user.password!,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// create post middlewares after save data
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

export const UserModel = model<TUser>('User', userSchema);
