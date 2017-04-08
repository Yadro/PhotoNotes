

export function notEqualArray(a: any[], b: any[]) {
  return a.length !== b.length || a.some(e => b.includes(e));
}

export function equalObject(a, b) {
  return Object.keys(a).every(key => {
    if (Array.isArray(a[key])) {
      return equalArray(a[key], b[key]);
    }
    return a[key] === b[key];
  });
}

export function equalArray(a: any[], b: any[]) {
  return a.length === b.length && a.every((e, i) => e === b[i]);
}