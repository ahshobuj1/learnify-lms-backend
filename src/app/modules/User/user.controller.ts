import { userService } from './user.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

const getAllUser = catchAsync(async (req, res) => {
  const result = await userService.getAllUser(req?.query);

  sendResponse(res, {
    message: 'All users retrieved successfully',
    meta: result?.meta,
    result: result?.result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const token = req.user;
  const result = await userService.getMe(token);

  sendResponse(res, {
    message: 'User is retrieved successfully',
    result: result,
  });
});

const changeUserStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userService.changeUserStatus(id, req.body);

  sendResponse(res, {
    message: 'Changed user status successfully!',
    result: result,
  });
});

export const userController = {
  getMe,
  changeUserStatus,
  getAllUser,
};
