import Link from "next/link";

const menu = [
  {
    name: "Persona",
    path: "/persona",
    children: [],
  },
  {
    name: "My Chat",
    path: "/chat",
    children: [],
  },
  {
    name: "My Note",
    path: "/note",
    children: [],
  },
  {
    name: "Activity",
    path: "/activity",
    children: [],
  },
  {
    name: "Settings",
    path: "/settings",
    children: [],
  },
  {
    name: "Help & Support",
    path: "/help",
    children: [],
  },
]


export default function Component () {
  return (
    <div className={'flex flex-col h-full w-[260px] bg-gray-100 p-4 text-gray-500 gap-6'}>
      <div className={'flex gap-4 p-2'}>
        <div className={'bg-white h-8 w-8 rounded-full overflow-hidden truncate'}>
          Avatar
        </div>
        <div>
          <div className={'text-sm'}>Tom</div>
          <div className={'text-xs'}>Estimated costs: $0.00</div>
        </div>
      </div>
      <div className={'flex flex-col gap-1'}>
        {
          menu.map((item, index) => (
            <Link href={item.path} key={index} className={'text-sm px-4 py-2 hover:bg-blue-100 hover:text-blue-400 rounded'}>
              {item.name}
            </Link>
          ))
        }
      </div>
    </div>
  )
}
