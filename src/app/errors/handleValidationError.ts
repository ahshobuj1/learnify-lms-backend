import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { TCommonErrorResponse } from '../interface/error';

export const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TCommonErrorResponse => {
  const errorSources = Object.values(err?.errors).map((value) => {
    return {
      path: value?.path,
      message: value?.message,
    };
  });

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'ValidationError',
    errorSources,
  };
};
