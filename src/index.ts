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
type Props = { readonly foo: string; bar: number };
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
