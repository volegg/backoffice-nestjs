export function permissionsFor(controllerName: string) {
  return {
    create: `${controllerName}:create`,
    read: `${controllerName}:read`,
    find: `${controllerName}:find`,
    update: `${controllerName}:update`,
    delete: `${controllerName}:delete`,
  };
};