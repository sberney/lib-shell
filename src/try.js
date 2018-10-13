export const tryFn = (fn, default_) => {
  try {
    return fn();
  }
  catch (ignore) {
    return default_;
  }
};
export const tryCall = method => obj =>
  tryFn(() => obj[method](), obj);