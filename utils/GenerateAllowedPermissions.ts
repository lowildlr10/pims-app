export const getAllowedPermissions = (moduleType?: ModuleType, action?: string) => {
  if (!moduleType || !action) {
    return ['super:*'];
  }

  return ['super:*', `${moduleType}:*`, `${moduleType}:${action}`];
};
