import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { testService } from './test.service';

const createTest = catchAsync(async (req, res) => {
  const result = await testService.createTest(req.body);

  sendResponse(res, { message: 'Test is created successfully', result });
});

const Test = catchAsync(async (req, res) => {
  const result = await testService.Test();

  sendResponse(res, { message: 'Testing successful!', result });
});

export const testController = {
  createTest,
  Test,
};
