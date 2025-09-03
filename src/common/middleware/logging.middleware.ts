import { Injectable, NestMiddleware, Logger, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrometheusMetrics } from '../monitoring/prometheus-metrics';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(
    @Inject(PrometheusMetrics) private readonly prometheus: PrometheusMetrics,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      Logger.log(`${req.method} ${req.originalUrl} - ${duration}ms`, 'HTTP');
      this.prometheus.countRequest(
        req.method,
        req.route?.path || req.originalUrl,
        res.statusCode.toString(),
      );
    });
    next();
  }
}
