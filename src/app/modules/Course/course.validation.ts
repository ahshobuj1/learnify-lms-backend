import { z } from 'zod';

// Zod schema for TLink
const linkValidationSchema = z.object({
  title: z.string(),
  url: z.string().url({ message: 'Invalid URL format' }),
});

// Zod schema for TCourseData
const courseDataValidationSchema = z.object({
  title: z.string(),
  description: z.string(),
  videoUrl: z.string(),
  videoSection: z.string(),
  videoLength: z.number().positive(),
  videoPlayer: z.string(),
  links: z.array(linkValidationSchema),
  suggestion: z.string(),
});

// Main Zod schema for TCourse
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
  demoUrl: z.string().url({ message: 'Invalid demo URL' }),
  benefits: z.array(z.object({ title: z.string() })),
  prerequisites: z.array(z.object({ title: z.string() })),
  courseData: z.array(courseDataValidationSchema),
  ratings: z.number().optional(),
  purchased: z.number().optional(),
});

export const courseValidations = {
  createCourse,
  // updateCourseValidation,
  // FacultyWithCourseValidation,
};
