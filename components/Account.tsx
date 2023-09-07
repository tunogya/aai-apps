import { getSession } from "@auth0/nextjs-auth0/edge";
import Image from "next/image";

export const runtime = "edge";

const Account = async () => {
  const session = await getSession();
  return (
    <div
      className={
        "ml-4 flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
      }
    >
      <Image src={session?.user.picture} width={30} height={30} alt={""} />
      <div className={"truncate"}>
        <div className={"text-sm text-gray-800 truncate"}>
          {session?.user.email}
        </div>
        <div className={"text-xs text-gray-500 font-light truncate"}>
          Estimate cost: $0
        </div>
      </div>
    </div>
  );
};

export default Account;
