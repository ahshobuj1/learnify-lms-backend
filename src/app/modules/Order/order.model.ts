import { model, Model, Schema } from 'mongoose';
import { TOrder } from './order.interface';

const orderSchema = new Schema<TOrder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  courseId: String,
  paymentInfo: {
    type: Object,
  },
});

export const OrderModel: Model<TOrder> = model<TOrder>('Order', orderSchema);

// import { model, Model, Schema } from 'mongoose';
// import { TOrder } from './order.interface';

// const orderSchema = new Schema<TOrder>(
//   {
//     // Reference to the user who made the order
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     // Reference to the course being purchased
//     courseId: {
//       type: Schema.Types.ObjectId,
//       ref: 'Course',
//       required: true,
//     },
//     // Detailed and validated payment information
//     paymentInfo: {
//       transactionId: { type: String, required: true },
//       status: {
//         type: String,
//         enum: ['pending', 'completed', 'failed'],
//         default: 'pending',
//       },
//       amount: { type: Number, required: true },
//       currency: { type: String, required: true, default: 'USD' },
//     },
//   },
//   {
//     // Automatically adds createdAt and updatedAt fields
//     timestamps: true,
//   }
// );

// export const OrderModel: Model<TOrder> = model<TOrder>('Order', orderSchema);
