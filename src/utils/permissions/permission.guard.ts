import { SetMetadata, CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppRoles, userDataAccessRoles } from '../../const';
import type { Request } from 'express';
import type { User } from '../../modules/user/model';
import { PermissionOperations } from '../../types';

const permissionKey = 'permissions';
const docOwner = 'docOwner';

export const Permissions = (...permissions: PermissionOperations[]) => SetMetadata(permissionKey, permissions);
export const IsOwner = (fieldName?: string) => SetMetadata(docOwner, fieldName);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector
      .get<string[]>(permissionKey, context.getHandler())
      .map((p) => context.getClass().name.slice(0, -10).toLowerCase() + ':' + p);

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) {
      throw new ForbiddenException('Executor not found or not authenticated');
    }

    if (user.roles.includes(AppRoles.halk)) {
      return true;
    }

    if (!user[permissionKey].length) {
      throw new ForbiddenException('User does not have any permissions');
    }

    const userPermissions = user[permissionKey].map((permission) => permission.toLowerCase());
    const hasPermission = requiredPermissions.every((prms) => userPermissions.includes(prms));

    if (!hasPermission) {
      throw new ForbiddenException('Forbidden, user does not have permission');
    }

    const hasDataAccessRole = user.roles.some((role) => userDataAccessRoles.includes(role));

    if (!hasDataAccessRole) {
      const requiresOwnRecord = this.reflector.get<string | undefined>(docOwner, context.getHandler());

      if (requiresOwnRecord) {
        const isOwnRecord = this.isDocOwner(requiresOwnRecord, request, user);

        if (!isOwnRecord) {
          throw new ForbiddenException('Forbidden, only owner can access');
        };
      }
    }

    return true;
  }

  private isDocOwner(fieldName: string, request: Request, user: User): boolean {
    const value = String(user.id);

    const rV = request.params && request.params[fieldName] && request.params[fieldName] === value;
    const rB = request.body && request.body[fieldName] && request.body[fieldName] === value;
    const rQ = request.query && request.query[fieldName] && request.query[fieldName] === value;

    return rV || rB || rQ;
  }
}
