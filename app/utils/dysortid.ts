import { nanoid } from "ai";

const encodeToBase62 = (num: number, size = 8) => {
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let encoded = "";
  while (num > 0) {
    const remainder = num % 62;
    encoded = chars[remainder] + encoded;
    num = Math.floor(num / 62);
  }
  while (encoded.length < size) {
    encoded = "0" + encoded;
  }
  return encoded;
};

const dysortid = () => {
  const timestamp = new Date().getTime();
  return `${encodeToBase62(timestamp, 8)}${nanoid(8)}`;
};

export default dysortid;
