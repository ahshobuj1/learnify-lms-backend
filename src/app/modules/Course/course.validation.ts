import { z } from 'zod';

// Link validation schema
const linkValidationSchema = z.object({
  title: z.string().optional(),
  url: z.string().url({ message: 'Invalid URL format' }).optional(),
});

// Course data validation schema
const courseDataValidationSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  videoSection: z.string().optional(),
  videoLength: z.number().positive().optional(),
  videoPlayer: z.string().optional(),
  links: z.array(linkValidationSchema).optional(),
  suggestion: z.string().optional(),
});

// Create course validation schema (original)
export const createCourse = z.object({
  name: z.string().min(1, { message: 'Course name is required' }),
  description: z.string().min(1, { message: 'Course description is required' }),
  price: z.number().positive({ message: 'Price must be a positive number' }),
  estimatedPrice: z.number().positive().optional(),
  thumbnail: z
    .object({
      public_id: z.string(),
      url: z.string().url(),
    })
    .optional(),
  tags: z.string().min(1, { message: 'Tags are required' }),
  level: z.string().min(1, { message: 'Level is required' }),
  demoUrl: z.string(), //.url({ message: 'Invalid demo URL' }),
  benefits: z.array(z.object({ title: z.string() })),
  prerequisites: z.array(z.object({ title: z.string() })),
  courseData: z.array(courseDataValidationSchema),
  ratings: z.number().optional(),
  purchased: z.number().optional(),
});

// Update course validation schema (all fields optional)
export const updateCourse = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  estimatedPrice: z.number().positive().optional(),
  thumbnail: z
    .object({
      public_id: z.string().optional(),
      url: z.string().url().optional(),
    })
    .optional(),
  tags: z.string().optional(),
  level: z.string().optional(),
  demoUrl: z.string().optional(), //url({ message: 'Invalid demo URL' })
  benefits: z.array(z.object({ title: z.string().optional() })).optional(),
  prerequisites: z.array(z.object({ title: z.string().optional() })).optional(),
  courseData: z.array(courseDataValidationSchema).optional(),
  ratings: z.number().optional(),
  purchased: z.number().optional(),
});

export const courseValidations = {
  createCourse,
  updateCourse,
};
