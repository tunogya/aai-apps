import NavigatorLayout from "../components/Navigator/NavigatorLayout";
import { Metadata } from "next";
export const runtime = "edge";

const title = "Billing - Abandon AI";
const description = "Powered by OpenAI";

export const metadata: Metadata = {
  title,
  description,
};
export default NavigatorLayout;
