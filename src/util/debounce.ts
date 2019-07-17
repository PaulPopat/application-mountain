export function debounce(func: () => void, wait: number): () => void;
export function debounce<T1>(
  func: (arg1: T1) => void,
  wait: number
): (arg1: T1) => void;
export function debounce<T1, T2>(
  func: (arg1: T1, arg2: T2) => void,
  wait: number
): (arg1: T1, arg2: T2) => void;
export function debounce(func: (...args: any[]) => void, wait: number) {
  let h: any;
  return (...args: any[]) => {
    clearTimeout(h);
    h = setTimeout(() => func(...args), wait);
  };
}
