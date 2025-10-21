import { model, Schema } from 'mongoose';
import { TUser } from './auth.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
//    preRequisiteCourses: { type: [preRequisiteCoursesSchema], default: [] },
//    const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>(
//   {
//     course: { type: Schema.Types.ObjectId, ref: 'Course' },
//     isDeleted: { type: Boolean, default: false },
//   },
//   {
//     _id: false,
//   },
// );

const userSchema = new Schema<TUser>(
  {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String, select: 0 },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'] },
    course: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// create pre middlewares before save data
userSchema.pre<TUser>('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  if (user.password) {
    user.password = await bcrypt.hash(
      user.password!,
      Number(config.bcrypt_salt_rounds),
    );

    next();
  }

  next();
});

// create post middlewares after save data
userSchema.post<TUser>('save', function (doc, next) {
  doc.password = '';
  next();
});

export const UserModel = model<TUser>('User', userSchema);
