import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { courseService } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const result = await courseService.createCourse(req.body);

  sendResponse(res, { message: 'Course is created successfully', result });
});

// const getAllCourse = catchAsync(async (req, res) => {
//   const result = await courseService.getAllCourse(req?.query);

//   sendResponse(res, {
//     message: 'Course is retrieved successfully',
//     meta: result?.meta,
//     result: result?.result,
//   });
// });

// const getSingleCourse = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await courseService.getSingleCourse(id);

//   sendResponse(res, { message: 'Course is retrieved successfully', result });
// });

// const updateCourse = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const updatedCourseData = req.body;
//   const result = await courseService.updateCourse(id, updatedCourseData);

//   sendResponse(res, { message: 'Course is updated successfully', result });
// });

// const deleteCourse = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await courseService.deleteCourse(id);

//   sendResponse(res, { message: 'Course is deleted successfully', result });
// });

// const updateFacultiesWithCourse = catchAsync(async (req, res) => {
//   const { courseId } = req.params;
//   const { faculties } = req.body;

//   const result = await courseService.updateFacultiesWithCourse(
//     courseId,
//     faculties,
//   );

//   sendResponse(res, {
//     message: 'Course Faculty is updated successfully',
//     result,
//   });
// });

// const getFacultiesWithCourse = catchAsync(async (req, res) => {
//   const { courseId } = req.params;

//   const result = await courseService.getFacultiesWithCourse(courseId);

//   sendResponse(res, {
//     message: 'Course Faculty is retrieved successfully',
//     result,
//   });
// });

// const removeFacultiesWithCourse = catchAsync(async (req, res) => {
//   const { courseId } = req.params;
//   const { faculties } = req.body;

//   const result = await courseService.removeFacultiesWithCourse(
//     courseId,
//     faculties,
//   );

//   sendResponse(res, {
//     message: 'Course Faculty is removed successfully',
//     result,
//   });
// });

export const courseController = {
  createCourse,
  // getAllCourse,
  // getSingleCourse,
  // updateCourse,
  // deleteCourse,
  // updateFacultiesWithCourse,
  // getFacultiesWithCourse,
  // removeFacultiesWithCourse,
};
