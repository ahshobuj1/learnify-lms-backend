import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload; // or just `any` if you don't have a type yet
    }
  }
}
