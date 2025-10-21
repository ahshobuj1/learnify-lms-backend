import { Types } from 'mongoose';

export type TUser = {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  course?: [Types.ObjectId];
  status: 'in-progress' | 'blocked';
  role: 'user' | 'admin';
  isDeleted: boolean;
};

export type TSocialLogin = {
  name: string;
  email: string;
  avatar?: string;
};

export type TActivateUser = {
  activate_code: string;
  activate_token: string;
};

export type TLogin = {
  email: string;
  password: string;
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export type TResetPassword = {
  email: string;
  newPassword: string;
  confirmPassword: string;
};

export const UserRole = {
  user: 'user',
  admin: 'admin',
} as const;

export type TUserRole = keyof typeof UserRole;
