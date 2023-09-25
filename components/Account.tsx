import { getSession } from "@auth0/nextjs-auth0/edge";
import Image from "next/image";
import md5 from "md5";

export const runtime = "edge";

const Account = async () => {
  const session = await getSession();
  return (
    <div
      className={
        "ml-4 flex items-center space-x-2 hover:bg-gary-100 px-2 py-1 rounded cursor-pointer"
      }
    >
      <div className={"border-2 border-white shadow overflow-hidden"}>
        <Image
          src={session?.user.picture}
          width={32}
          height={32}
          alt={""}
          priority={true}
        />
      </div>
      <div className={"truncate"}>
        <div
          className={"text-sm text-gary-800 truncate font-semibold select-none"}
        >
          {session?.user.email}
        </div>
      </div>
    </div>
  );
};

export default Account;
