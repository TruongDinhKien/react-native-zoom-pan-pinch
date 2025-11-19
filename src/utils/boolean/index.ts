export const isFunction = (fn: any): fn is Function =>
  fn && typeof fn === 'function';
