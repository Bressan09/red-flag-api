import jwt from 'jsonwebtoken';
import { API_KEY } from '../env';
import restify from 'restify';
import logger from './logger';

const authenticated = (
  req: restify.Request,
  res: restify.Response,
  next: restify.Next
): void => {
  const token = req.headers.authorization || '';
  logger.info('token: ' + token);
  jwt.verify(token, API_KEY, (err, _) => {
    if (err) {
      res.json('Token not provided');
    } else {
      next();
    }
  });
};

export const verifyToken = (token: string): any | boolean => {
  try {
    const decoded = jwt.verify(token, API_KEY);
    return decoded;
  } catch {
    return false;
  }
};

export default authenticated;
