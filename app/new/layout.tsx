import { Metadata } from "next";
export const runtime = "edge";

const title = "New Persona - AbandonAI";
const description = "Powered by OpenAI";

export const metadata: Metadata = {
  title,
  description,
};
export default function NavigatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={"flex h-full w-full"}>
      <div className={"pt-6 px-10 w-full h-full overflow-y-auto"}>
        {children}
      </div>
    </div>
  );
}
