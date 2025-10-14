import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.service';

const register = catchAsync(async (req, res) => {
  // const file = req.file;

  const payload = req.body;
  const result = await authServices.register(payload);

  sendResponse(res, {
    message: `Please check your email ${payload.email} to activate your email!`,
    result: result,
  });
});

const login = catchAsync(async (req, res) => {
  const result = await authServices.login(req.body);
  const { refreshToken, accessToken, needPasswordChange } = result;

  // set refresh token to cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true, // config.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    message: 'User logged in successfully',
    result: { accessToken, needPasswordChange },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await authServices.changePassword(req.user, req.body);

  sendResponse(res, {
    message: 'password is changed successfully',
    result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.refreshToken(refreshToken);

  sendResponse(res, {
    message: 'refresh token is retrieved successfully',
    result,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await authServices.forgotPassword(email);

  sendResponse(res, {
    message: 'Check your email to reset password! ',
    result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new AppError(httpStatus.FORBIDDEN, 'you are not authorized!');
  }

  const result = await authServices.resetPassword(req.body, token as string);

  sendResponse(res, {
    message: 'reset password successfully! ',
    result,
  });
});

export const authController = {
  register,
  login,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,
};
