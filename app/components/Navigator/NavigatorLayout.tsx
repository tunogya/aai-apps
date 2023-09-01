import Menu from "./index";

export default function NavigatorLayout({children}: { children: React.ReactNode }) {
  return (
    <div className={'flex h-full'}>
      <Menu/>
      <div className={'pt-6 px-10'}>
        {children}
      </div>
    </div>
  )
}