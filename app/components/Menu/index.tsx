import Image from 'next/image'
import MenuList from './MenuList'

export default function Component() {

  return (
    <div className={'flex flex-col h-full w-[260px] bg-gray-100 text-gray-500 gap-6 relative'}>
      <div className={'flex gap-2 mt-5 mx-3 p-2.5'}>
        <div className={'bg-white h-8 w-8 rounded-full border-gray-200 border'}>
        </div>
        <div>
          <div className={'text-sm font-semibold'}>Tom</div>
          <div className={'text-xs'}>Estimated costs: $0.00</div>
        </div>
      </div>
      <MenuList />
      <div className={'absolute bottom-0 w-full pl-6 pb-6 pt-6 pr-4'}>
        <div className={'flex items-center w-full gap-0.5'}>
          <Image src={'/favicon.svg'} alt={''} width={'32'} height={'32'}/>
          <div className={'text-xs ml-3'}>|</div>
          <button className={'text-xs px-3 py-2 hover:bg-gray-200 rounded w-full text-start'}>ABANDON INC.</button>
        </div>
      </div>
    </div>
  )
}
