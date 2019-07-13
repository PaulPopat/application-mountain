export function build_classes(classes: {
  [key: string]: boolean | undefined | null;
}) {
  const result: string[] = [];
  for (const key in classes) {
    if (classes.hasOwnProperty(key) && classes[key]) {
      result.push(key);
    }
  }

  return result.join(" ");
}

export function class_list(...classes: string[]) {
  return classes.join(" ");
}
