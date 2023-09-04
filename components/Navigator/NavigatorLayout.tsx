import Menu from "./index";

export default function NavigatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={"flex h-full w-full"}>
      <Menu />
      <div className={"pt-6 px-10 w-full h-full overflow-y-auto"}>
        {children}
      </div>
    </div>
  );
}
