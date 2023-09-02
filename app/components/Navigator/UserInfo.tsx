'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image'

const userInfo = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user} = useUser();

  return (
    <div className={'flex gap-2 mt-5 mx-3 p-2.5'}>
      <div className={'bg-white h-8 w-8 rounded-full overflow-hidden'}>
        <Image src={user?.picture!} height={32} width={32} alt={''} />
      </div>
      <div>
        <div className={'text-sm font-semibold'}>{user?.name ?? 'myself'}</div>
        <div className={'text-xs'}>Estimated costs: $0.00</div>
      </div>
    </div>
  )
}

export default userInfo