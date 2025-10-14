import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

// higher-order middleware func
const validationChecker = (validateSchema: AnyZodObject) => {
  //middleware func
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //validation check
    await validateSchema.parseAsync(req.body);
    return next();
  });
};

export default validationChecker;
