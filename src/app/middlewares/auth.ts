import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TUserRole } from '../modules/Auth/auth.interface';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../errors/AppError';
import config from '../config';
import { UserModel } from '../modules/Auth/auth.model';

// higher-order middleware func
const auth = (...requiredRoles: TUserRole[]) => {
  //middleware func
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // check if token is undefined

    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    // verify token
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // decoded user role and id
    const { role, email } = decoded;

    // check is user exists
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // check user status
    if (user?.status === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'The user is blocked');
    }

    // check user isDeleted
    if (user?.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'The user is deleted');
    }

    // check authorization access by role
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // check if password changed after creating jwt token : Token is no longer valid due to password change

    // if (user?.passwordUpdatedAt) {
    //   const passwordUpdatedAtInSeconds = Math.floor(
    //     new Date(user?.passwordUpdatedAt).getTime() / 1000,
    //   );

    //   if (passwordUpdatedAtInSeconds > (iat as number)) {
    //     throw new AppError(
    //       httpStatus.UNAUTHORIZED,
    //       'Token is no longer valid due to password change',
    //     );
    //   }
    // }

    // set user to express req
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
