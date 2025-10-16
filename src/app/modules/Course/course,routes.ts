import { Router } from 'express';
import { courseController } from './course.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../Auth/auth.interface';
import { courseValidations } from './course.validation';
import validationChecker from '../../middlewares/validationChecker';

const router = Router();

router.post(
  '/create-course',
  auth(UserRole.user, UserRole.admin),
  validationChecker(courseValidations.createCourse),
  courseController.createCourse,
);

router.get('/', courseController.getAllCourse);
router.get('/:id', courseController.getSingleCourse);

router.patch(
  '/update-course/:id',
  auth(UserRole.admin, UserRole.user),
  validationChecker(courseValidations.updateCourse),
  courseController.updateCourse,
);

router.delete(
  '/soft-delete/:id',
  auth(UserRole.admin, UserRole.user),
  courseController.deleteCourse,
);

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
