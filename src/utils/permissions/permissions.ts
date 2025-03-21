import type { PermissionOperations } from '../../types';

export function permissionsFor(controllerName: string): Record<PermissionOperations, string> {
  return {
    create: `${controllerName}:create`,
    read: `${controllerName}:read`,
    find: `${controllerName}:find`,
    update: `${controllerName}:update`,
    delete: `${controllerName}:delete`,
  };
};