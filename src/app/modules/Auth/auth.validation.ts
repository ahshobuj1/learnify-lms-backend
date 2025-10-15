import { z } from 'zod';

const create = z.object({
  name: z.string(),
  avatar: z.string().optional(),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email('Invalid email address')
    .trim()
    .toLowerCase()
    .max(100, 'Email cannot exceed 100 characters'),

  password: z
    .string()
    .max(20, { message: "password can't be more then 20 characters" })
    .min(6, { message: "password can't be less then 6 characters" }),
});

const activateUser = z.object({
  activate_code: z.string({ required_error: 'Opt is required!' }),
  activate_token: z.string({
    required_error: 'Activation token is required..!',
  }),
});

const socialLogin = z.object({
  name: z.string(),
  email: z.string({ required_error: 'Id is required!' }),
  avatar: z.string().optional(),
});

const login = z.object({
  email: z.string({ required_error: 'Id is required!' }),
  password: z.string({ required_error: 'Password is required!' }),
});

const changeStatus = z.object({
  status: z.enum(['in-progress', 'blocked'], {
    invalid_type_error: 'Status must be in-progress | blocked ',
  }),
});

const changePassword = z.object({
  oldPassword: z.string({ required_error: 'Old password is required!' }),
  newPassword: z.string({ required_error: 'New password is required!' }),
});

export const authValidations = {
  create,
  activateUser,
  socialLogin,
  login,
  changeStatus,
  changePassword,
};
