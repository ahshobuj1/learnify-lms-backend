import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { UserModel } from '../Auth/auth.model';
import { AppError } from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';

const getAllUser = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(UserModel.find(), query)
    .search(['email', 'name'])
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return { meta, result };
};

const getMe = async (token: JwtPayload) => {
  const { email } = token;
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User not found, Insert correct email..!',
    );
  }

  return { user };
};

export const notificationService = {
  getMe,
  getAllUser,
};
