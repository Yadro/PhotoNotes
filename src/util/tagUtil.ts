export const Tags = {
  trash: 'trash',
  password: 'password',
};

export const check = (tag: string) => {
  let include;
  let query;
  if (tag.charAt(0) == '!') {
    include = false;
    query = tag.substr(1);
  } else {
    include = true;
    query = tag;
  }
  return (values: string[]) => {
    const res = values.indexOf(query);
    return include ? res > -1 : res == -1;
  };
};