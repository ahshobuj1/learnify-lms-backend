import { Router } from 'express';
import validationChecker from '../../middlewares/validationChecker';
import { authValidations } from './auth.validation';
import { authController } from './auth.controller';
import auth from '../../middlewares/auth';
import { UserRole } from './auth.interface';

const router = Router();

router.post(
  '/register',
  // upload.single('file'),
  // formDataToJSON,
  validationChecker(authValidations.create),
  authController.register,
);

router.post(
  '/activate-user',
  validationChecker(authValidations.activateUser),
  authController.activateUser,
);

router.post(
  '/login',
  validationChecker(authValidations.login),
  authController.login,
);

router.post(
  '/change-password',
  auth(UserRole.admin, UserRole.user),
  validationChecker(authValidations.changePassword),
  authController.changePassword,
);

router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export const authRoutes = router;
