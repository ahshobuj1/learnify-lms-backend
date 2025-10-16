import httpStatus from 'http-status';
import { TCourse } from './course,interface';
import { CourseModel } from './course.model';
import { AppError } from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { redis } from '../../utils/redisDB';

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

// without purchasing
const getAllCourse = async (query: Record<string, unknown>) => {
  // Use redis cache
  const cacheKey = 'allCourses';
  const isCacheDataExist = await redis.get(cacheKey);

  // send courses data from cache
  if (isCacheDataExist) {
    console.log('from cache');
    const course = JSON.parse(isCacheDataExist);
    return course;
  }

  console.log('Hitting mongodb');

  const courseQuery = new QueryBuilder(
    CourseModel.find()
      .select(
        '-courseData.suggestion -courseData.videoUrl -courseData.links -courseData.videoSection -courseData.videoLength -courseData.title',
      )
      .populate('reviews.user'),
    query,
  )
    .filter()
    .sort()
    .pagination()
    .fields();
  // .search(courseSearchableFields)

  const result = await courseQuery.modelQuery;
  const meta = await courseQuery.countTotal();

  const responseCourses = { meta, result };

  // set cache to redis
  await redis.set(cacheKey, JSON.stringify(responseCourses));

  return responseCourses;
};

// without purchasing
const getSingleCourse = async (id: string) => {
  // Use redis cache
  const cacheKey = id;
  const isCacheDataExist = await redis.get(cacheKey);

  // send courses data from cache
  if (isCacheDataExist) {
    console.log('from cache');
    const course = JSON.parse(isCacheDataExist);
    return course;
  }

  console.log('from mongodbj');

  const result = await CourseModel.findById(id)

    .select(
      '-courseData.suggestion -courseData.videoUrl -courseData.links -courseData.videoSection -courseData.videoLength -courseData.title',
    )
    .populate('reviews.user');

  // set cache to redis
  await redis.set(cacheKey, JSON.stringify(result));

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
