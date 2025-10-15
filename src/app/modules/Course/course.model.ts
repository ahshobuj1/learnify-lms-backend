import { model, Model, Schema } from 'mongoose';
import {
  TComment,
  TCourse,
  TCourseData,
  TLink,
  TReview,
} from './course,interface';

const commentSchema = new Schema<TComment>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  comment: String,
  commentReplies: [Object], // For nested replies
});

const reviewSchema = new Schema<TReview>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
  commentReplies: [commentSchema],
});

const linkSchema = new Schema<TLink>({
  title: String,
  url: String,
});

const courseDataSchema = new Schema<TCourseData>({
  title: String,
  description: String,
  videoUrl: String,
  videoSection: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema],
});

const courseSchema = new Schema<TCourse>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    estimatedPrice: {
      type: Number,
    },
    thumbnail: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    tags: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    demoUrl: {
      type: String,
      required: true,
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
      type: Number,
      default: 0,
    },
    purchased: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Created and export the model
export const CourseModel: Model<TCourse> = model<TCourse>(
  'Course',
  courseSchema,
);
