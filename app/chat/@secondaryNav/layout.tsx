import { ReactNode } from "react";

export const runtime = "edge";

export default function Layout(props: { children: ReactNode }) {
  return (
    <div
      className={
        "w-full max-w-[300px] shrink-0 h-full border-r space-y-10 overflow-y-auto"
      }
    >
      {props.children}
    </div>
  );
}
