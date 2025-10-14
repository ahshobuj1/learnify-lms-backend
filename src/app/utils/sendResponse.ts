import { Response } from 'express';
import httpStatus from 'http-status';

const sendResponse = <T>(
  res: Response,
  data: {
    message: string;
    result: T;
  },
) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: data?.message,
    data: data?.result,
  });
};

export default sendResponse;
