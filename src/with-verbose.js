
export const withVerbose = (opts={}, operation) => {
  const { verbose } = opts;

  if (verbose) {
    return operation.
    catch(error => {
      console.error(error);
      throw error;
    });
  } else {
    return operation;
  }
}