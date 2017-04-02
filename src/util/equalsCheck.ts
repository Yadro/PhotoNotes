

export function notEqualArray(a: any[], b: any[]) {
  return a.length !== b.length || a.some(e => b.includes(e));
}