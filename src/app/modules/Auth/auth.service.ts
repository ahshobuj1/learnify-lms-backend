import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import {
  TChangePassword,
  TLogin,
  TResetPassword,
  TUser,
} from './auth.interface';
import { UserModel } from './auth.model';
import { AppError } from '../../errors/AppError';
import { sendEmail } from '../../utils/sendEmail';
import { sendVerificationEmail } from '../../utils/sendVerificationEmail';
import { createActivationToken } from './auth.utils';

const register = async (payload: TUser) => {
  const isUserExist = await UserModel.findOne({ email: payload.email });

  if (isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User email already exist');
  }

  const user = {
    email: payload.email,
    password: payload.password,
  };

  const activationDetail = createActivationToken(user);
  const activationCode = activationDetail.activationCode;

  const options = {
    to: payload.email,
    userName: payload.name,
    activationCode: activationCode,
  };

  await sendVerificationEmail(options);

  // const userData: Partial<TUser> = {
  //   name: payload.name,
  //   email: payload.email,
  //   password: payload.password,
  //   role: 'user',
  //   status: 'in-progress',
  //   isDeleted: false,
  //   needPasswordChange: true,
  // };

  // const createUser = await UserModel.create(userData);

  // if (!createUser) {
  //   throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user..?');
  // }

  return { activationToken: activationDetail.token };
};

const login = async (payload: TLogin) => {
  // 1-> check exists user
  // 2-> check status is blocked
  // 3-> check isDeleted
  // 4-> check password is correct
  // 5-> create jwt token and sent to client

  // check if user exists
  const user = await UserModel.findOne({ email: payload.email }).select(
    '+password',
  );

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User not found, Insert correct Id',
    );
  }

  //check if the user isDeleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
  }

  // check if the user status is blocked
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  // check password is correct -> compare to bcrypt hashing password
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    user?.password as string,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Incorrect password!');
  }

  // create jwt token
  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in as jwt.SignOptions['expiresIn'],
  });

  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    {
      expiresIn: config.jwt_refresh_expires_in as jwt.SignOptions['expiresIn'],
    },
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user?.needPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: TChangePassword,
) => {
  // console.log('auth service -> ', payload, userData);

  // check user exists and get user data
  const user = await UserModel.findOne({
    email: userData.email,
    role: userData.role,
  }).select('+password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // check old password is correct
  const isPasswordMatched = await bcrypt.compare(
    payload.oldPassword,
    user.password as string,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Incorrect old password!');
  }

  // hash new password
  const hashNewPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // now change password
  const changedPassword = await UserModel.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: hashNewPassword,
      needPasswordChange: false,
      // passwordUpdatedAt: new Date(),
    },
    { new: true },
  );

  return changedPassword;
};

const refreshToken = async (token: string) => {
  // console.log(token);

  // if (!token) {
  //   throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  // }

  // verify token
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  // decoded user role and id
  const { email } = decoded;

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

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in as jwt.SignOptions['expiresIn'],
  });

  return { accessToken };
};

const forgotPassword = async (email: string) => {
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

  // create jwt token
  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10m',
  });

  const resetPasswordUiLink = `${config.reset_pass_ui_link}?email=${email}&token=${accessToken}`;

  // send the link to the user email
  await sendEmail(user?.email, resetPasswordUiLink, 'Reset your password!');
};

const resetPassword = async (payload: TResetPassword, token: string) => {
  // verify token
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  if (decoded.email !== payload.email) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'you are not authorized! Invalid ID',
    );
  }

  // check is user exists
  const user = await UserModel.findOne({ email: decoded.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // check user status
  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'The user is blocked!');
  }

  // check user isDeleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'The user is deleted!');
  }

  // check if newPassword and confirm new password is matched
  if (payload.newPassword !== payload.confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'New password and confirm password do not match!',
    );
  }

  const hashNewPassword = await bcrypt.hash(
    payload.confirmPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // finally update hash password
  await UserModel.findOneAndUpdate(
    { email: user.email },
    {
      password: hashNewPassword,
      passwordUpdatedAt: new Date(),
      needsPasswordChange: false,
    },
  );
};

export const authServices = {
  register,
  login,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,
};
