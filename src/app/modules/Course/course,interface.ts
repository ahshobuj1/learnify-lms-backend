import { Types } from 'mongoose';

// Interface for comments
export type TComment = {
  user: Types.ObjectId;
  comment: string;
  commentReplies?: TComment[];
};

// export type for reviews
export type TReview = {
  user: Types.ObjectId;
  rating: number;
  comment: string;
  commentReplies?: TComment[];
};

// export type for links within course data
export type TLink = {
  title: string;
  url: string;
};

// export type for individual course data/lectures
export type TCourseData = {
  title: string;
  description: string;
  videoUrl: string;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: TLink[];
  suggestion: string;
  questions?: TComment[];
};

// Main export type for the course
export type TCourse = {
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnail?: object;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews?: TReview[];
  courseData: TCourseData[];
  ratings?: number;
  purchased?: number;
  isDeleted?: boolean;
};
