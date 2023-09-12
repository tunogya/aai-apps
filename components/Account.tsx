import { getSession } from "@auth0/nextjs-auth0/edge";
import Image from "next/image";
import md5 from "md5";

export const runtime = "edge";

const Account = async () => {
  const session = await getSession();
  return (
    <div
      className={
        "ml-4 flex items-center space-x-2 hover:bg-stone-100 px-2 py-1 rounded cursor-pointer"
      }
    >
      <div className={"border-2 border-white shadow overflow-hidden"}>
        <Image src={session?.user.picture} width={32} height={32} alt={""} />
      </div>
      <div className={"truncate"}>
        <div className={"text-sm text-stone-800 truncate font-semibold"}>
          {session?.user.email}
        </div>
        {/*<div className={"text-xs text-stone-500 font-light truncate"}>*/}
        {/*  Estimate cost: $0*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default Account;