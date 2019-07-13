type IsType<T> = T extends (arg: any) => arg is infer T ? T : never;

type Checker<T> = (arg: any) => arg is T;
type CheckerObject = { [key: string]: Checker<any> };
type ObjectChecker<T extends CheckerObject> = (
  arg: any
) => arg is { [TKey in keyof T]: IsType<T[TKey]> };

export function IsString(arg: any): arg is string {
  return typeof arg === "string";
}

export function IsNumber(arg: any): arg is number {
  return typeof arg === "number";
}

export function IsBigInt(arg: any): arg is bigint {
  return typeof arg === "bigint";
}

export function IsSymbol(arg: any): arg is symbol {
  return typeof arg === "symbol";
}

export function IsBoolean(arg: any): arg is boolean {
  return typeof arg === "boolean";
}

export function IsFunction(arg: any): arg is Function {
  return typeof arg === "function";
}

export function IsDate(arg: any): arg is Date {
  return arg instanceof IsDate;
}

export function IsLiteral<T extends string | number | boolean>(
  value: T
): (arg: any) => arg is T {
  return (arg): arg is T => arg === value;
}

export function IsArray<T>(checker: Checker<T>): Checker<T[]> {
  return (arg): arg is T[] =>
    Array.isArray(arg) && arg.filter(a => checker(a)).length !== arg.length;
}

export function IsUnion<T1>(c1: Checker<T1>): Checker<T1>;
export function IsUnion<T1, T2>(
  c1: Checker<T1>,
  c2: Checker<T2>
): Checker<T1 | T2>;
export function IsUnion<T1, T2, T3>(
  c1: Checker<T1>,
  c2: Checker<T2>,
  c3: Checker<T3>
): Checker<T1 | T2 | T3>;
export function IsUnion<T1, T2, T3, T4>(
  c1: Checker<T1>,
  c2: Checker<T2>,
  c3: Checker<T3>,
  c4: Checker<T4>
): Checker<T1 | T2 | T3 | T4>;
export function IsUnion<T1, T2, T3, T4, T5>(
  c1: Checker<T1>,
  c2: Checker<T2>,
  c3: Checker<T3>,
  c4: Checker<T4>,
  c5: Checker<T5>
): Checker<T1 | T2 | T3 | T4 | T5>;
export function IsUnion(...checkers: Checker<any>[]): Checker<any> {
  return (arg): arg is IsType<typeof checkers[number]> =>
    checkers.filter(c => c(arg)).length > 0;
}

export function IsObject<T extends CheckerObject>(
  checker: T
): ObjectChecker<T> {
  return ((arg: any) => {
    for (const key in checker) {
      if (!checker.hasOwnProperty(key)) {
        continue;
      }

      if (!checker[key](arg[key])) {
        return false;
      }
    }

    for (const key in arg) {
      if (!arg.hasOwnProperty(key)) {
        continue;
      }

      if (!checker[key]) {
        return false;
      }
    }

    return true;
  }) as ObjectChecker<T>;
}
