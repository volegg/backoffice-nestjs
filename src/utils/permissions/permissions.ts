export function permissionsFor(controllerName: string) {
  return {
    create: `${controllerName}:create`,
    read: `${controllerName}:read`,
    readAny: `${controllerName}:read:any`,
    update: `${controllerName}:update`,
    updateAny: `${controllerName}:update:any`,
    delete: `${controllerName}:delete`,
    deleteAny: `${controllerName}:delete:any`,
  };
};