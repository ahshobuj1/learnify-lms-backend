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

const updateUser = async (
  token: JwtPayload,
  payload: { avatar: string; name: string },
) => {
  const { email } = token;
  const updatedUser = await UserModel.findOneAndUpdate({ email }, payload, {
    new: true,
  });

  return updatedUser;
};

const changeUserStatus = async (
  id: string,
  payload: { status: string; role: string },
) => {
  const result = await UserModel.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const userService = {
  getMe,
  changeUserStatus,
  getAllUser,
  updateUser,
};
