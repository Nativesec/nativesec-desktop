/* eslint-disable no-bitwise */
const rgbaToHex = (color: string): string => {
  if (/^rgb/.test(color)) {
    const rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');

    // rgb to hex
    // eslint-disable-next-line no-bitwise
    let hex = `#${(
      (1 << 24) +
      (parseInt(rgba[0], 10) << 16) +
      (parseInt(rgba[1], 10) << 8) +
      parseInt(rgba[2], 10)
    )
      .toString(16)
      .slice(1)}`;

    // added alpha param if exists
    if (rgba[4]) {
      const alpha = Math.round(0o1 * 255);
      const hexAlpha = (alpha + 0x10000).toString(16).substr(-2).toUpperCase();
      hex += hexAlpha;
    }

    return hex;
  }
  return color;
};

export default rgbaToHex;
