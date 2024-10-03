import { bech32 } from "bech32";
import { Buffer } from "buffer";

export const decodeKey = (encodedKey: string) => {
  try {
    const decoded = bech32.decode(encodedKey);
    return Buffer.from(bech32.fromWords(decoded.words)).toString("hex");
  } catch (error) {
    console.error("Error decoding key:", error);
    return null;
  }
};

export const encodeKey = (prefix: string, key: string) => {
  try {
    const words = bech32.toWords(Buffer.from(key, "hex"));
    return bech32.encode(prefix, words);
  } catch (error) {
    console.error("Error encoding key:", error);
    return null;
  }
};
