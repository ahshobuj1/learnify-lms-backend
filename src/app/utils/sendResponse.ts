import { Response } from 'express';
import httpStatus from 'http-status';

type TMeta = {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
};

const sendResponse = <T>(
  res: Response,
  data: {
    message: string;
    meta?: TMeta;
    result: T;
  },
) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: data?.message,
    meta: data?.meta,
    data: data?.result,
  });
};

export default sendResponse;
