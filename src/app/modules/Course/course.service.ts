import httpStatus from 'http-status';
import {
  TAddComment,
  TAnswerComment,
  TComment,
  TCourse,
} from './course,interface';
import { CourseModel } from './course.model';
import { AppError } from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { redis } from '../../utils/redisDB';
import { UserModel } from '../Auth/auth.model';
import { JwtPayload } from 'jsonwebtoken';
import { sendEmailCommon } from '../../utils/sendCommentReplayEmail';

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

  // console.log('Hitting mongodb');

  const courseQuery = new QueryBuilder(
    CourseModel.find()
      .select(
        '-courseData.suggestion -courseData.videoUrl -courseData.links -courseData.videoSection -courseData.videoLength -courseData.title',
      )
      .populate('courseData.questions.user')
      .populate('courseData.questions.commentReplies.user')
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

  // console.log('from mongodb');

  const result = await CourseModel.findById(id)

    .select(
      '-courseData.suggestion -courseData.videoUrl -courseData.links -courseData.videoSection -courseData.videoLength -courseData.title',
    )
    .populate('courseData.questions.user')
    .populate('courseData.questions.commentReplies.user')
    .populate('reviews.user');

  // set cache to redis
  await redis.set(cacheKey, JSON.stringify(result));

  return result;
};

// For user who purchased
const getCourseByUser = async (id: string, user: JwtPayload) => {
  const userExist = await UserModel.findOne({ email: user.email });
  // console.log(userExist);

  if (!userExist) {
    throw new AppError(httpStatus.NOT_FOUND, `User not found..!`);
  }

  const isCoursePurchased = userExist.course?.find(
    (course) => course.courseId.toString() === id,
  );

  if (!isCoursePurchased) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      `You are not alignable for this course..!`,
    );
  }

  const course = await CourseModel.findById(id);
  const result = course?.courseData;

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

const addComment = async (payload: TAddComment, token: JwtPayload) => {
  const { comment, courseId, contentId } = payload;

  const course = await CourseModel.findById(courseId).populate(
    'courseData.questions.user',
  );
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, `Course is not found..!`);
  }

  const courseContent = course?.courseData?.find(
    (item) => item?._id.toString() === contentId,
  );

  if (!courseContent) {
    throw new AppError(httpStatus.NOT_FOUND, `Invalid course content id..!`);
  }

  const user = await UserModel.findOne({ email: token.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, `User is not found..!`);
  }

  const newComment: TComment = {
    user: user?._id,
    comment: comment,
    commentReplies: [],
  };

  courseContent.questions?.push(newComment);
  await course.save();

  return course;
};

const answerComment = async (payload: TAnswerComment, token: JwtPayload) => {
  const { comment, courseId, contentId, commentId } = payload;

  const course = await CourseModel.findById(courseId).populate(
    'courseData.questions.user',
  );

  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, `Course is not found..!`);
  }

  const courseContent = course?.courseData?.find(
    (item) => item?._id.toString() === contentId,
  );

  if (!courseContent) {
    throw new AppError(httpStatus.NOT_FOUND, `Invalid course content id..!`);
  }

  const user = await UserModel.findOne({ email: token.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, `User is not found..!`);
  }

  const commentContent = courseContent?.questions?.find(
    (item: TComment) => item?._id?.toString() === commentId,
  );

  const commentedUser = await UserModel.findById(commentContent?.user);

  if (!commentedUser) {
    throw new AppError(httpStatus.NOT_FOUND, `User is not found..!`);
  }

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, `Comment not found..!`);
  }

  const newComment = {
    user: user?._id,
    comment: comment,
  };

  commentContent?.commentReplies?.push(newComment);
  await course.save();

  const replayUserData = {
    email: user.email,
    title: courseContent.title,
  };

  if (user?._id === commentContent?.user?._id) {
    //
  } else {
    const options = {
      to: commentedUser.email,
      subject: 'Question Reply at Learnify',
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hello ${commentedUser.name || ''},</p>
      
      <p>A new reply has been added from ${replayUserData.email} to your question in the video "${replayUserData.title}".</p>
      
      <p>Please login to our website to view the reply and continue the discussion.</p>
      
      <p>Thank you for being a part of our community.</p>
    </div>
  `,
    };

    //* send otp to email
    await sendEmailCommon(options);
  }

  return course;
};

export const courseService = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  getCourseByUser,
  updateCourse,
  deleteCourse,
  addComment,
  answerComment,
};
