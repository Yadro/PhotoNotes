
export function getElementType(el: JSX.Element): string {
  if (typeof el.type === "string") {
    return el.type;
  }
  return el.type.name;
}
