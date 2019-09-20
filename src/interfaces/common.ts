import { IJwtSignPayload } from '../auth/jwt.strategy';
import { Request } from 'express';

export interface IApiResponse<T = any> {
  data?: T;
  error?: string;
}

export interface IApiRequest extends Request {
  user?: IJwtSignPayload;
}
