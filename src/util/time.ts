export function wait(timeout: number) {
  return new Promise(res => setTimeout(() => res(), timeout));
}
