import { Router } from 'express';
import { testController } from './test.controller';
import validationChecker from '../../middlewares/validationChecker';
import { createTestValidation } from './test.validation';

const router = Router();

router.get('/', testController.Test);

router.post(
  '/create-test',
  validationChecker(createTestValidation),
  testController.createTest,
);

export const testRoutes = router;
