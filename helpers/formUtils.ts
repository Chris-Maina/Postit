export const ERROR_MESSAGES = {
  REQUIRED: 'Field is reqiured',
  EMAIL: 'Should be valid email',
  MATCH: (regexp) => `Should match ${regexp.source}`,
  MIN_LENGTH: (number) => `Should have length at least ${number}`,
  MAX_LENGTH: (number) => `Should have length at most ${number}`,
  NUMBER: 'Provide a value greater than 0',
};

export const validateReguired = (value) => {
  if (!value || !(value && String(value).trim().length)) {
    return ERROR_MESSAGES.REQUIRED;
  }
  return null;
};

export const validateEmail = (value) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/m;
  if (!value.match(re)) {
    return ERROR_MESSAGES.EMAIL;
  }
  return null;
};

export const validateMinLength = (value = '', minLength) => {
  if (value.length < minLength) {
    return ERROR_MESSAGES.MIN_LENGTH(minLength);
  }

  return null;
};

export const validateMaxLength = (value = '', maxLength) => {
  if (value.length >= maxLength) {
    return ERROR_MESSAGES.MAX_LENGTH(maxLength);
  }

  return null;
};
