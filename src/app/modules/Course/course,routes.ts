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
router.get(
  '/user-course-content/:id',
  auth(UserRole.user),
  courseController.getCourseByUser,
);

router.put(
  '/add-comment',
  auth(UserRole.user, UserRole.admin),
  courseController.addComment,
);

router.put(
  '/answer-comment',
  auth(UserRole.user, UserRole.admin),
  courseController.answerComment,
);

router.put(
  '/add-review/:id',
  auth(UserRole.user, UserRole.admin),
  courseController.addReview,
);

router.put(
  '/replay-review',
  auth(UserRole.user, UserRole.admin),
  courseController.replayReview,
);

router.patch(
  '/update-course',
  auth(UserRole.admin, UserRole.user),
  validationChecker(courseValidations.updateCourse),
  courseController.updateCourse,
);

router.delete(
  '/soft-delete/:id',
  auth(UserRole.admin, UserRole.user),
  courseController.deleteCourse,
);

export const courseRoutes = router;
