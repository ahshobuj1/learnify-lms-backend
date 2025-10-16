import httpStatus from 'http-status';
import { TCourse } from './course,interface';
import { CourseModel } from './course.model';
import { AppError } from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';

const createCourse = async (payload: TCourse) => {
  const isCourseExists = await CourseModel.findOne({ name: payload.name });

  if (isCourseExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Course name: ${payload.name} already exists!`,
    );
  }

  const result = await CourseModel.create(payload);
  return result;
};

const getAllCourse = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    CourseModel.find().populate('reviews.user'),
    query,
  )
    .filter()
    .sort()
    .pagination()
    .fields();
  // .search(courseSearchableFields)

  const result = await courseQuery.modelQuery;
  const meta = await courseQuery.countTotal();

  return { meta, result };
};

const getSingleCourse = async (id: string) => {
  const result = await CourseModel.findById(id).populate('reviews.user');

  return result;
};

const updateCourse = async (id: string, payload: Partial<TCourse>) => {
  const basicCourseUpdateInfo = await CourseModel.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
    },
  );

  return basicCourseUpdateInfo;
};

const deleteCourse = async (id: string) => {
  const result = await CourseModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    },
  );

  return result;
};

// const updateFacultiesWithCourse = async (
//   courseId: string,
//   payload: Partial<TCourseFaculty>,
// ) => {
//   // Add faculties from array
//   const result = await CourseFacultyModel.findByIdAndUpdate(
//     courseId,
//     {
//       course: courseId,
//       $addToSet: { faculties: { $each: payload } },
//     },
//     { upsert: true, new: true },
//   );

//   return result;
// };

// const getFacultiesWithCourse = async (courseId: string) => {
//   // Add faculties from array
//   const result = await CourseFacultyModel.findOne({
//     course: courseId,
//   }).populate('faculties');

//   return result;
// };

// const removeFacultiesWithCourse = async (
//   id: string,
//   payload: Partial<TCourseFaculty>,
// ) => {
//   // Remove faculties from array
//   const result = await CourseFacultyModel.findByIdAndUpdate(
//     id,
//     {
//       $pull: { faculties: { $in: payload } },
//     },
//     { new: true },
//   );

//   return result;
// };

export const courseService = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  // updateFacultiesWithCourse,
  // getFacultiesWithCourse,
  // removeFacultiesWithCourse,
};
