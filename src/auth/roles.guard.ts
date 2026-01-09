// import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

// export class RolesGuard implements CanActivate {
//   constructor(private allowedRoles: string[]) {}

//   canActivate(context: ExecutionContext): boolean {
//     const req = context.switchToHttp().getRequest();
//     const user = req.user;

//     if (!this.allowedRoles.includes(user.role)) {
//       throw new ForbiddenException('Access denied');
//     }
//     return true;
//   }
// }


import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
