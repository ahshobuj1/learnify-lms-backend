import { z } from 'zod';

export const createTestValidation = z.object({
  name: z.string({ required_error: 'Name is required!' }),
});
