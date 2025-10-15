import { z } from 'zod';

const changedStatus = z.object({
  status: z.enum(['in-progress', 'blocked'], {
    invalid_type_error: 'Status must be in-progress | blocked ',
  }),
  role: z.enum(['user', 'admin'], {
    invalid_type_error: 'Role must be user | admin ',
  }),
});

const updateProfile = z.object({
  name: z.string(),
  avatar: z.string(),
});

export const userValidation = {
  changedStatus,
  updateProfile,
};
