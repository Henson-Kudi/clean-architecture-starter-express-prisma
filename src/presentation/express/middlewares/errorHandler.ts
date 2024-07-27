// Change this file to handle errors as you would like
import { ErrorRequestHandler } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorRequestHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error((err as Error).message, err);

  return res.status(500).json({ message: err });
};

export default errorRequestHandler;
