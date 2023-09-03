import NavigatorLayout from "../components/Navigator/NavigatorLayout";
import { Metadata } from "next";
export const runtime = "edge";

const title = "Chat - AbandonAI";
const description = "Powered by OpenAI";

export const metadata: Metadata = {
  title,
  description,
};
export default NavigatorLayout;
