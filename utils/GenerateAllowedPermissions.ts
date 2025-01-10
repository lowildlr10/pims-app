export const getAllowedPermissions = (module?: ModuleType, action?: string) => {
  if (!module || !action) {
    return ['super:*'];
  }

  return ['super:*', `${module}:*`, `${module}:${action}`];
};
