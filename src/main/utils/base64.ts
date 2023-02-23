export const toBase64 = (text: string) => {
  try {
    return Buffer.from(encodeURIComponent(text));
  } catch (e) {
    return null;
  }
};
export const fromBase64 = (text: string) => {
  try {
    return Buffer.from(text, 'base64');
  } catch (e) {
    return null;
  }
};

export default { toBase64, fromBase64 };
