import { bech32 } from "bech32";
import { Buffer } from "buffer";

export const decodeKey = (encodedKey: string) => {
  const decoded = bech32.decode(encodedKey);
  return Buffer.from(bech32.fromWords(decoded.words)).toString("hex");
};

export const encodeKey = (prefix: string, key: string) => {
  const words = bech32.toWords(Buffer.from(key, "hex"));
  return bech32.encode(prefix, words);
};
