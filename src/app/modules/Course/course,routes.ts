import { Router } from 'express';
import { courseController } from './course.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../Auth/auth.interface';

const router = Router();

router.post(
  '/create-course',
  auth(UserRole.user, UserRole.admin),
  // validationChecker(courseValidations.createCourseValidation),
  courseController.createCourse,
);

// router.get(
//   '/',
//   auth(UserRole.superAdmin, UserRole.admin, UserRole.faculty, UserRole.student),
//   courseController.getAllCourse,
// );
// router.get(
//   '/:id',
//   auth(UserRole.superAdmin, UserRole.admin, UserRole.faculty, UserRole.student),
//   courseController.getSingleCourse,
// );

// router.patch(
//   '/:id',
//   auth(UserRole.superAdmin, UserRole.admin),
//   validationChecker(courseValidations.updateCourseValidation),
//   courseController.updateCourse,
// );

// router.delete(
//   '/:id',
//   auth(UserRole.superAdmin, UserRole.admin),
//   courseController.deleteCourse,
// );

// router.put(
//   '/:courseId/assign-course-faculties',
//   auth(UserRole.superAdmin, UserRole.admin),
//   validationChecker(courseValidations.FacultyWithCourseValidation),
//   courseController.updateFacultiesWithCourse,
// );

// router.get(
//   '/:courseId/get-course-faculties',
//   auth(UserRole.superAdmin, UserRole.admin, UserRole.faculty, UserRole.student),
//   courseController.getFacultiesWithCourse,
// );

// router.delete(
//   '/:courseId/remove-course-faculties',
//   auth(UserRole.superAdmin, UserRole.admin),
//   validationChecker(courseValidations.FacultyWithCourseValidation),
//   courseController.removeFacultiesWithCourse,
// );

export const courseRoutes = router;
