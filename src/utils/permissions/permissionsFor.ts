import type { PermissionOperations } from '../../types';

export function permissionsFor(controllerName: string): Record<PermissionOperations, string> {
  return {
    create: `${controllerName}:create`,
    view: `${controllerName}:view`,
    find: `${controllerName}:find`,
    edit: `${controllerName}:edit`,
    delete: `${controllerName}:delete`,
  };
};