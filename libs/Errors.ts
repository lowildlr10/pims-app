export const getErrors = (error: any) => {
  const errors = error?.response?.data?.errors;

  if (typeof errors === 'object') {
    const errorLists = Object.keys(errors)?.map((key) => errors[key][0]);
    return errorLists;
  }

  if (error?.response?.data?.message === 'Unauthenticated.' || error.message === 'Unauthenticated.') {
    window.location.href = '/login';
  }

  return [error?.response?.data?.message ?? error.message];
};
