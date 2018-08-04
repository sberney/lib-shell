const tryFn = (fn, default_) => {
  try {
    fn();
  }
  catch (ignore) {
    return default_;
  }
};
const tryCall = method => obj =>
  tryFn(() => obj[method](), obj);

module.exports = { tryFn, tryCall };