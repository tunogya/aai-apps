import { nanoid } from "ai";

const dysortid = () => {
  const timestamp = new Date().getTime();
  const id = nanoid();
  return `${timestamp}${id}`;
};

export default dysortid;
