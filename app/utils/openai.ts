import OpenAI from "openai";
import * as process from "process";

const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
});

export default openai;
