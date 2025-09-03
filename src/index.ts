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
    [K in keyof T]: [T[K]] extends [ValueType] ? K : never;
  }[keyof T]
>;

type Props = { req: number; reqUndef: number | undefined; opt?: string };
// Expect: { req: number }
type a = PickByValueExact<Props, number>;
// Expect: { reqUndef: number | undefined; }
type b = PickByValueExact<Props, number | undefined>;
