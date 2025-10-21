import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { UserModel } from '../Auth/auth.model';
import { AppError } from '../../errors/AppError';
import { TOrder } from './order.interface';
import { CourseModel } from '../Course/course.model';
import { OrderModel } from './order.model';
import { NotificationModel } from '../Notification/notification.model';
import { sendEmail } from '../../utils/sendEmail';
import path from 'path';
import ejs from 'ejs';

const createOrder = async (token: JwtPayload, payload: TOrder) => {
  const { courseId, paymentInfo } = payload;

  const user = await UserModel.findOne({ email: token.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found..!');
  }

  // (All your validation logic remains the same...)
  const courseAlreadyPurchased = user?.course?.find(
    (course) => course && course?._id?.toString() === courseId,
  );

  if (courseAlreadyPurchased) {
    throw new AppError(
      httpStatus.CONFLICT,
      'You have already purchased this course..!',
    );
  }

  const course = await CourseModel.findById(courseId);
  if (!course) {
    throw new AppError(httpStatus.CONFLICT, 'Course not found..!');
  }

  const data = {
    courseId: course?._id,
    userId: user?._id,
    paymentInfo,
  };

  const createdOrder = await OrderModel.create(data);

  const mailData = {
    id: course?._id?.toString().slice(0, 6),
    name: course.name,
    price: course.price,
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };

  const html = await ejs.renderFile(
    // eslint-disable-next-line no-undef
    path.join(__dirname, '../../mails/order-confirmation.ejs'),
    { order: mailData },
  );

  const options = {
    to: user.email,
    subject: 'Your ELearning Order is Confirmed!',
    html: html,
  };

  sendEmail(options);

  // (User update and notification logic also here)
  user?.course?.push(course._id);
  await user?.save();

  await NotificationModel.create({
    userId: user?._id,
    title: 'New Order',
    message: `You have successfully purchased the course: ${course?.name}`,
  });

  course.purchased = (course.purchased || 0) + 1;
  await course.save();

  return createdOrder;
};

export const orderService = {
  createOrder,
};
