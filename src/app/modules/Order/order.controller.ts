import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { orderService } from './order.service';

const createOrder = catchAsync(async (req, res) => {
  const token = req.user;
  const result = await orderService.createOrder(token, req?.body);

  sendResponse(res, {
    message: 'Order is created successfully',
    result: result,
  });
});

export const orderController = {
  createOrder,
};
