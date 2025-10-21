import { Router } from 'express';
import { orderController } from './order.controller';
import { UserRole } from '../Auth/auth.interface';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
  '/create-order',
  auth(UserRole.admin, UserRole.user),
  orderController.createOrder,
);

export const orderRoutes = router;
