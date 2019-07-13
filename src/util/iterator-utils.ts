export function* select<TInput, TResult>(
  input: IterableIterator<TInput>,
  map: (e: TInput) => TResult
) {
  for (const i of input) {
    yield map(i);
  }
}
