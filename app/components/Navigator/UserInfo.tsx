'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image'

const userInfo = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user} = useUser();

  return (
    <div className={'flex gap-2 mt-5 mx-3 p-2.5 group'}>
      <div className={'rounded-full min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] overflow-hidden'}>
        <Image src={user?.picture!} height={32} width={32} alt={''} />
      </div>
      <div className={'w-full relative'}>
        <div className={'text-sm font-semibold'}>{user?.name ?? 'myself'}</div>
        <div className={'text-xs'}>Estimated costs: $0.00</div>
        <a href={'/api/auth/logout'}
          className={'absolute top-0 right-0 hidden group-hover:block cursor-pointer'}>
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24"
               strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </a>
      </div>
    </div>
  )
}

export default userInfo