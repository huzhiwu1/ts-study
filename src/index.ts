export type NonUndefined<T> = T extends undefined ? never : T;
export type FunctionKeys<T extends object> = {
  [U in keyof T]-?: T[U] extends Function ? U : never;
}[keyof T];
type MixedProps = {
  name: string;
  setName: (name: string) => void;
  someKeys?: string;
  someFn?: (...args: any) => any;
};

// Expect: "setName | someFn"
// type Keys = FunctionKeys<MixedProps>;
// 可选参数的函数不能 extends Function,因为可选参数的函数比  Function多了个undefined的选项
// type a = MixedProps["someFn"] extends Function ? true : false;

type NonFunctionKeys<T extends object> = {
  [U in keyof T]-?: NonUndefined<T[U]> extends Function ? never : U;
}[keyof T];

type IfEqual<X, Y, A = X, B = never> = (<T>() => T extends Y ? 1 : 2) extends <
  T
>() => T extends X ? 1 : 2
  ? A
  : B;

// Expect: "name | someKey"
// type Keys = NonFunctionKeys<MixedProps>;

type MutableKeys<T extends object> = {
  [U in keyof T]-?: IfEqual<
    { [P in U]: T[P] },
    { -readonly [P in U]: T[P] },
    U
  >;
}[keyof T];
// type Props = { readonly foo: string; bar: number };
// Expect: "bar"

// type Keys = MutableKeys<Props>;

// type a = {
//   name: "a";
// };
// type b = {
//   readonly name: "a";
// };
// 两个相同属性的类，不会因为属性名上是否有readonly而不能extends
// yes
// type c = a extends b ? "yes" : "no";
// yes
// type d = a extends b ? "yes" : "no";

type ReadonlyKeys<T extends object> = {
  [K in keyof T]: IfEqual<
    { [P in K]: T[K] },
    { -readonly [P in K]: T[K] },
    never,
    K
  >;
}[keyof T];
// type Props = { readonly foo: string; bar: number };

// // Expect: "foo"
// type Keys = ReadonlyKeys<Props>;

export type RequiredKeys<T extends object> = {
  [K in keyof T]-?: {} extends { [P in K]: T[P] } ? never : K;
}[keyof T];
// type Props = {
//   req: number;
//   reqUndef: number | undefined;
//   opt?: string;
//   optUndef?: number | undefined;
// };
// Expect: "req" | "reqUndef"
// type Keys = RequiredKeys<Props>;

// //  false
// type a = {} extends { name: 1 } ? true : false;
// // true
// type b = {} extends { name?: 1 } ? true : false;

export type OptionalKeys<T extends object> = {
  [K in keyof T]-?: {} extends {
    [P in K]: T[K];
  }
    ? K
    : never;
}[keyof T];
// type Props = {
//   req: number;
//   reqUndef: number | undefined;
//   opt?: string;
//   optUndef?: number | undefined;
// };
// // Expect: "opt" | "optUndef"
// type Keys = OptionalKeys<Props>;

// export type PickByValue<T extends object, ValueType> = Pick<
//   T,
//   {
//     [K in keyof T]-?: { [P in K]: T[P] } extends { [P in K]: ValueType }
//       ? K
//       : never;
//   }[keyof T]
// >;

// 根据valueType找到属性名，通过pick和属性名选出属性
export type PickByValue<T extends object, ValueType> = Pick<
  T,
  {
    [K in keyof T]-?: T[K] extends ValueType ? K : never;
  }[keyof T]
>;
// type Props = { req: number; reqUndef: number | undefined; opt?: string };
// Expect: { req: number }
// type a = PickByValue<Props, number>;
// // Expect: { req: number; reqUndef: number | undefined; }
// type b = PickByValue<Props, number | undefined>;

// type a = number extends number | undefined ? true : false;

export type PickByValueExact<T extends object, ValueType> = Pick<
  T,
  {
    [K in keyof T]: [T[K]] extends [ValueType]
      ? [ValueType] extends [T[K]]
        ? K
        : never
      : never;
  }[keyof T]
>;

// type Props = { req: number; reqUndef: number | undefined; opt?: string };
// // Expect: { req: number }
// type a = PickByValueExact<Props, number>;
// // Expect: { reqUndef: number | undefined; }
// type b = PickByValueExact<Props, number | undefined>;

export type Omit<T extends object, U extends keyof any> = Pick<
  T,
  {
    [K in keyof T]-?: K extends U ? never : K;
  }[keyof T]
>;

// type Props = { name: string; age: number; visible: boolean };

// Expect: { name: string; visible: boolean; }
// type a = Omit<Props, "age">;

export type OmitByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? never : Key }[keyof T]
>;

// type Props = { req: number; reqUndef: number | undefined; opt?: string };

// // Expect: { reqUndef: number | undefined; opt?: string; }
// type a = OmitByValue<Props, number>;
// // Expect: { opt?: string; }
// type b = OmitByValue<Props, number | undefined>;

export type Extract<K extends keyof any, U extends keyof any> = K extends U
  ? K
  : never;
export type Intersection<T extends object, U extends object> = Pick<
  T,
  Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>;

// type Props = { name: string; age: number; visible: boolean };
// type DefaultProps = { age: number };

// // Expect: { age: number; }
// type DuplicateProps = Intersection<Props, DefaultProps>;
export type setDifference<
  T extends keyof any,
  U extends keyof any
> = T extends U ? never : T;
export type Diff<T extends object, U extends object> = Pick<
  T,
  setDifference<keyof T, keyof U>
>;
// type Props = { name: string; age: number; visible: boolean };
// type DefaultProps = { age: number };

// // Expect: { name: string; visible: boolean; }
// type DiffProps = Diff<Props, DefaultProps>;

export type PromiseType<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;

// export type DeepPartial<T extends object> = {
//   [K in keyof T]+?: T[K] extends object ? DeepPartial<T[K]> : T[K] | undefined;
// };

type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? DeepPartial<U>
  : T extends object
  ? {
      [K in keyof T]?: DeepPartial<T[K]>;
    }
  : T;
// type ob = {
//   a: {
//     name: string;
//   };
//   age: number;
// };

// type a = DeepPartial<ob>;

// true
// type b = [] extends object?true:false
// true
// type c = (() => void) extends object?true:false
// false
// type d = (()=>void) extends Array<any>?true:false

export type DeepReadonly<T> = T extends Function
  ? T
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
  ? {
      readonly [K in keyof T]: DeepReadonly<T[K]>;
    }
  : T;

// type ob = {
//   a: {
//     name: string;
//   };
//   age: number;
//   say: () => void;
//   arr: string[];
// };

// type a = DeepReadonly<ob>;

export type DeepRequired<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? Array<DeepRequired<U>>
  : T extends object
  ? {
      [K in keyof T]-?: DeepRequired<T[K]>;
    }
  : T;

// Expect: {
//   first: {
//     second: {
//       name: string;
//     };
//   };
// }
// type NestedProps = {
//   first?: {
//     second?: {
//       name?: string;
//     };
//   };
// };
// type RequiredNestedProps = DeepRequired<NestedProps>;

export type DeepNonNullable<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? Array<DeepNonNullable<U>>
  : T extends object
  ? {
      [K in keyof T]-?: DeepNonNullable<T[K]>;
    }
  : NonNullable<T>;
// Expect: {
//   first: {
//     second: {
//       name: string;
//     };
//   };
// }
// type NestedProps = {
//   first?: null | {
//     second?: null | {
//       name?: string | null | undefined;
//     };
//   };
//   arr: [
//     {
//       a?: null | "a";
//     }
//   ];
//   say?: null | (() => void);
// };
// type RequiredNestedProps = DeepNonNullable<NestedProps>;

export type ValuesType<
  T extends Array<any> | ReadonlyArray<any> | ArrayLike<any> | Record<any, any>
> = T extends Array<any>
  ? T[number]
  : T extends ReadonlyArray<any>
  ? T[number]
  : T extends ArrayLike<any>
  ? T[number]
  : T extends object
  ? T[keyof T]
  : never;
type Props = { name: string; age: number; visible: boolean };
// Expect: string | number | boolean
type PropsValues = ValuesType<Props>;

type NumberArray = number[];
// Expect: number
type NumberItems = ValuesType<NumberArray>;

type ReadonlySymbolArray = readonly symbol[];
// Expect: symbol
type SymbolItems = ValuesType<ReadonlySymbolArray>;

type NumberTuple = [1, 2];
// Expect: 1 | 2
type NumberUnion = ValuesType<NumberTuple>;

type ReadonlyNumberTuple = readonly [1, 2];
// Expect: 1 | 2
type AnotherNumberUnion = ValuesType<NumberTuple>;

type BinaryArray = Uint8Array;
// Expect: number
type BinaryItems = ValuesType<BinaryArray>;
