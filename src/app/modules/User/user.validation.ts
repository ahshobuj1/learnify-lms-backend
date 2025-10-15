import { z } from 'zod';

const changedStatus = z.object({
  status: z.enum(['in-progress', 'blocked'], {
    invalid_type_error: 'Status must be in-progress | blocked ',
  }),
});

export const userValidation = {
  changedStatus,
};
