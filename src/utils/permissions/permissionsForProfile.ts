import type { PermissionProfileOperations } from '../../types';

export function permissionsForProfile(): Record<PermissionProfileOperations, string> {
  return {
    view: 'profile:view',
    edit: 'profile:edit',
    delete: 'profile:delete',
    transactions: 'profile:transactions'
  };
};