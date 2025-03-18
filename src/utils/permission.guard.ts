import { SetMetadata, CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppRoles } from '../const';
import type { Request } from 'express';
import type { User } from 'modules/user/model';

const permissionKey = 'permissions';
const docOwner = 'docOwner';

export const Permissions = (...permissions: string[]) => SetMetadata(permissionKey, permissions);
export const IsOwner = (fieldName?: string) => SetMetadata(docOwner, fieldName);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector
      .get<string[]>(permissionKey, context.getHandler())
      .map((p) => context.getClass().name.slice(0, -10) + ':' + p);

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Executor not found or not authenticated');
    }

    if (user.roles.includes(AppRoles.halk)) {
      return true;
    }

    if (!user.permissions.length || !user.roles.length) {
      throw new ForbiddenException('User does not have any permissions');
    }

    let hasAnyMarkToAvoidOwner = false;

    const hasPermission = requiredPermissions.every(permission => {
      if (permission.endsWith(':any')) {
        hasAnyMarkToAvoidOwner = true;
      }

      return user.permissions.includes(permission);
    });

    if (!hasPermission) {
      throw new ForbiddenException('Forbidden, user does not have permission');
    }

    const requiresOwnRecord = this.reflector.get<string | undefined>(docOwner, context.getHandler());

    if (requiresOwnRecord && !hasAnyMarkToAvoidOwner) {
      const isOwnRecord = this.isDocOwner(requiresOwnRecord, request, user);

      if (!isOwnRecord) {
        throw new ForbiddenException('Forbidden, only owner can access');
      };
    }

    return true;
  }

  private isDocOwner(fieldName: string, request: Request, user: User): boolean {
    const value = String(user[fieldName]);

    if (request.params && request.params[fieldName] && request.params[fieldName] === value) {
      return true;
    }

    if (request.body && request.body[fieldName] && request.body[fieldName] === value) {
      return true;
    }

    if (request.query && request.query[fieldName] && request.query[fieldName] === value) {
      return true;
    }

    return false;
  }
}
