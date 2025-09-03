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
type Keys = FunctionKeys<MixedProps>;
// 可选参数的函数不能 extends Function,因为可选参数的函数比  Function多了个undefined的选项
// type a = MixedProps["someFn"] extends Function ? true : false;
