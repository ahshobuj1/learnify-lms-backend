import jwt from 'jsonwebtoken';
import { TUser } from './auth.interface';
import config from '../../config';

// Define the interface for the activation token payload
interface IActivationToken {
  token: string;
  activationCode: string;
}

// Function to create an activation token
export const createActivationToken = (
  user: Partial<TUser>,
): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    config.jwt_access_secret as string,
    {
      expiresIn: '5m',
    },
  );

  return { token, activationCode };
};
