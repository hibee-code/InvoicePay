import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

@Injectable()
export class PrometheusMetrics {
  countRequest(method: string, route: string, status: string) {
    httpRequestCounter.inc({ method, route, status });
  }
}
