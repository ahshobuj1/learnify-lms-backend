import httpStatus from 'http-status';
import { ZodError, ZodIssue } from 'zod';
import { TCommonErrorResponse, TErrorSources } from '../interface/error';

export const handleZodError = (err: ZodError): TCommonErrorResponse => {
  const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'ZodError',
    errorSources,
  };
};
