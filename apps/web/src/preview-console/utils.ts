const TOKEN_CLEANUP_REGEX = /[.\?"',/#!$%^&*;:፤።{}=\-_`~()]/g;

export const sanitizeToken = (value: string) =>
    value.replace(TOKEN_CLEANUP_REGEX, "");
