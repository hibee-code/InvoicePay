import { Injectable, CanActivate, ExecutionContext, HttpStatus, HttpException } from '@nestjs/common';

const RATE_LIMIT = 100;
const WINDOW_MS = 15 * 60 * 1000;
const ipRequests: Record<string, { count: number; timestamp: number }> = {};

@Injectable()
export class RateLimitGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const ip = req.ip;
    const now = Date.now();
    if (!ipRequests[ip] || now - ipRequests[ip].timestamp > WINDOW_MS) {
      ipRequests[ip] = { count: 1, timestamp: now };
    } else {
      ipRequests[ip].count++;
      if (ipRequests[ip].count > RATE_LIMIT) {
        throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
      }
    }
    return true;
  }
}
