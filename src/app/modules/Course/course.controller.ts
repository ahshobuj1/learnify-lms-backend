import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { courseService } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const result = await courseService.createCourse(req.body);

  sendResponse(res, { message: 'Course is created successfully', result });
});

const getAllCourse = catchAsync(async (req, res) => {
  const result = await courseService.getAllCourse(req?.query);

  sendResponse(res, {
    message: 'Course is retrieved successfully',
    meta: result?.meta,
    result: result?.result,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseService.getSingleCourse(id);

  sendResponse(res, { message: 'Course is retrieved successfully', result });
});

const getCourseByUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const result = await courseService.getCourseByUser(id, user);

  sendResponse(res, { message: 'Course is retrieved successfully', result });
});

const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedCourseData = req.body;
  const result = await courseService.updateCourse(id, updatedCourseData);

  sendResponse(res, { message: 'Course is updated successfully', result });
});

const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseService.deleteCourse(id);

  sendResponse(res, { message: 'Course is deleted successfully', result });
});

const addComment = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await courseService.addComment(req.body, user);

  sendResponse(res, { message: 'Comment is added successfully', result });
});

export const courseController = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  getCourseByUser,
  updateCourse,
  deleteCourse,
  addComment,
};
