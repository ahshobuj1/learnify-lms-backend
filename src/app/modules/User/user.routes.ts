import { userController } from './user.controller';
import { Router } from 'express';
import validationChecker from '../../middlewares/validationChecker';
import auth from '../../middlewares/auth';
import { UserRole } from '../Auth/auth.interface';
import { userValidation } from './user.validation';

const router = Router();

router.get('/', auth(UserRole.admin, UserRole.user), userController.getAllUser);
router.get('/me', auth(UserRole.admin, UserRole.user), userController.getMe);
router.patch(
  '/update-profile',
  auth(UserRole.admin, UserRole.user),
  userController.updateUser,
);

router.patch(
  '/change-status/:id',
  auth(UserRole.admin, UserRole.user),
  validationChecker(userValidation.changedStatus),
  userController.changeUserStatus,
);

export const userRoutes = router;
