import restify from 'restify';

export class ErrorHandler extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export const handleError = (err: ErrorHandler, res: restify.Response): void => {
  const { statusCode, message } = err;
  /*
  res.status(statusCode).json({
    status: 'error',
    success: false,
    statusCode,
    message
  });
  */
};
