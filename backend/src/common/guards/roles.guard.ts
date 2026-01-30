import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRole, ROLES_KEY } from './roles.decorator';

// Extend Request to include user property
interface AuthenticatedRequest extends Request {
  user?: { roles?: UserRole[] };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const { user } = request;

    // In a real app, user would be populated by AuthGuard (JWT Strategy)
    // For now, if no user, we deny (or check mock header for dev).
    if (!user) {
      const mockRole = request.headers['x-mock-role'] as string;
      if (mockRole && Object.values(UserRole).includes(mockRole as UserRole)) {
        return requiredRoles.includes(mockRole as UserRole);
      }
      throw new UnauthorizedException('User not authenticated');
    }

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
