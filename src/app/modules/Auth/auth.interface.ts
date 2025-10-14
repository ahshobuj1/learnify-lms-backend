export type TUser = {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  status: 'in-progress' | 'blocked';
  role: 'user' | 'admin';
  needPasswordChange: boolean;
  isDeleted: boolean;
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
