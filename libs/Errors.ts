export const getErrors = (error: any) => {
  const errors = error?.response?.data?.errors;

  if (typeof errors === 'object') {
    const errorLists = Object.keys(errors)?.map((key) => errors[key][0]);
    return errorLists;
  }

  return [error?.response?.data?.message ?? error.message];
};
