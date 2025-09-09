import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Counter, Histogram } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly httpRequestsTotal: Counter<string>, // counter metric

    @InjectMetric('http_request_duration_seconds')
    private readonly httpRequestDuration: Histogram<string>, // histogram metric
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000; // convert ms → seconds

      // increment counter
      this.httpRequestsTotal.inc({
        method: req.method,
        route: req.route?.path || req.originalUrl,
        status: res.statusCode.toString(),
      });

      // record duration
      this.httpRequestDuration.observe(
        {
          method: req.method,
          route: req.route?.path || req.originalUrl,
          status: res.statusCode.toString(),
        },
        duration,
      );
    });

    next();
  }
}