/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status';
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import { TErrorSources } from '../interface/error';
import { handleZodError } from '../errors/handleZodError';
import { handleValidationError } from '../errors/handleValidationError';
import { handleCastError } from '../errors/handleCastError';
import { AppError } from '../errors/AppError';

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || 'something went wrong';
  let errorSources: TErrorSources = [
    { path: '', message: 'something went wrong' },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.node_env === 'development' ? err?.stack : null,
  });
};

// send error res with this pattern
/*  
      {
        success,
        message,
        errorSources: [{
            path,
            message
        }],
        stack: only for dev
      }
  */
