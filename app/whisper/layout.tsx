import Menu from "../components/Menu";

export default function Layout({children}: { children: React.ReactNode }) {
  return (
    <div className={'flex h-full'}>
      <Menu/>
      {children}
    </div>
  )
}
