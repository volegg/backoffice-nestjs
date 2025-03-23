import { SetMetadata, CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppRoles } from '../../const';
import type { User } from '../../modules/users/model';
import { PermissionProfileOperations } from '../../types';

const permissionKey = 'permissions';

export const PermissionsProfile = (...permissions: PermissionProfileOperations[]) => SetMetadata(permissionKey, permissions);

@Injectable()
export class PermissionsProfileGuard implements CanActivate {
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

    const userPermissions = user[permissionKey].join(',').toLowerCase();
    const hasPermission = requiredPermissions.every((prms) => userPermissions.search(prms.toLowerCase()) > -1);

    if (!hasPermission) {
      throw new ForbiddenException('Forbidden, user does not have permission');
    }

    return true;
  }
}
