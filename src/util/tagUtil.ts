export const Tags = {
  trash: 'trash',
  password: 'password',
};

export const check = (tags: string[], isWhite: boolean) => {
  return (values: string[]) => {
    if (isWhite) {
      return tags.some(tag => values.indexOf(tag) > -1);
    }
    return tags.length == 0 || tags.some(tag => values.indexOf(tag) == -1);
  };
};