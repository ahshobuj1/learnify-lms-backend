import { Router } from 'express';
import { testRoutes } from '../modules/Test/test.routes';
import { authRoutes } from '../modules/Auth/auth.routes';

const router = Router();

const modulesRoutes = [
  {
    path: '/test',
    route: testRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
];

modulesRoutes.forEach((data) => router.use(data.path, data.route));

export default router;
