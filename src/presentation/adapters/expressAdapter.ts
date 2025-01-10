import { NextFunction, Request, Response } from 'express';
import RequestObject from '../../utils/types/requestObject';
import IContoller from '../http/controllers/Icontroller';
import AppError from '../../domain/value-objects/appError';
import { ResponseCodes } from '../../domain/enums/responseCode';
import { ReturnValue } from '../../domain/value-objects/returnValue';

export default function expressAdapter<T = unknown>(controller: IContoller<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request: RequestObject = {
        ...req,
        body: req.body,
        query: req.query,
        params: req.params,
        ip: req.ip,
        method: req.method,
        path: req.path,
        headers: {
          'content-type': req.get('Content-Type'),
          Referer: req.get('referer'),
          'user-agent': req.get('User-Agent'),
          ...(req.headers ?? {}),
        },
        cookies: req.cookies,
        app: req.app,
        baseUrl: req.baseUrl,
        fresh: req.fresh,
        hostname: req.hostname,
        ips: req.ips,
        originalUrl: req.originalUrl,
        protocol: req.protocol,
        route: req.route,
        secure: req.secure,
        signedCookies: req.signedCookies,
        stale: req.stale,
        subdomains: req.subdomains,
        xhr: req.xhr,
        res: req.res,
        device: req.headers['user-agent'],
      };

      if (!request.ip) {
        request.ip =
          req.ips[0] ??
          (Array.isArray(req.headers['x-forwarded-for'])
            ? req.headers['x-forwarded-for'][0]
            : req.headers['x-forwarded-for']);
      }

      const result = (await controller.handle(request)) as ReturnValue<T>;

      if (!result.success) {
        next(
          result?.error ??
            new AppError(
              result?.message ?? 'Unexpected error',
              ResponseCodes.ServerError,
              null
            )
        );
      } else {
        res.status(201).json(result);
      }
    } catch (err) {
      if (err instanceof AppError) {
        next(err);
      } else {
        next(
          new AppError((err as Error).message, ResponseCodes.ServerError, null)
        );
      }
    }
  };
}
