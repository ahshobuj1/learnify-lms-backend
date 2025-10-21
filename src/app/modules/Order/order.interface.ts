import { Types } from 'mongoose';

export type TOrder = {
  courseId: string;
  userId: Types.ObjectId;
  paymentInfo: object;
};

// import { Types } from 'mongoose';

// export type TOrder = {
//   userId: Types.ObjectId; // Reference to User
//   courseId: Types.ObjectId; // Reference to Course
//   paymentInfo: {
//     transactionId: string;
//     status: 'pending' | 'completed' | 'failed';
//     amount: number;
//     currency: string;
//   };
//   createdAt: Date; // Added by timestamps
//   updatedAt: Date; // Added by timestamps
// };
