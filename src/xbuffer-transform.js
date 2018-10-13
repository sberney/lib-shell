
const defaultMaxBuffer = 200 * 1024;
export const xbufferTransform = (opts={}) => {
  const { xbuffer, maxBuffer } = opts;

  if (xbuffer && maxBuffer)
    throw new Error(`Cannot set both xbuffer (${xbuffer}) and maxBuffer (${maxBuffer}). Pick one or the other.`);
  if (typeof xbuffer !== 'number' && typeof xbuffer !== 'undefined')
    throw new Error(`xbuffer must be a number.`);

  if (xbuffer) {
    return Object.assign({}, opts, {
      maxBuffer: Math.min(
        1,
        Math.round(xbuffer * defaultMaxBuffer)
      )
    });
  } else {
    return opts;
  }
}