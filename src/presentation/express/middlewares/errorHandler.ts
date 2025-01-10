// Change this file to handle errors as you would like
import { ErrorRequestHandler } from 'express';
import logger from '../../../utils/logger';
import AppError from '../../../domain/value-objects/appError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorRequestHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error((err as Error).message, err);

  if (err instanceof AppError) {
    return res.status(err.code).json(err.toJSON());
  }

  return res.status(500).json({ message: err });
};

export default errorRequestHandler;
