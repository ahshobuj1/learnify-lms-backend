import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { TCommonErrorResponse, TErrorSources } from '../interface/error';

export const handleCastError = (
  err: mongoose.Error.CastError,
): TCommonErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: err?.path,
      message: err?.message,
    },
  ];

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Invalid ID',
    errorSources,
  };
};
