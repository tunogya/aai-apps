import { getSession } from "@auth0/nextjs-auth0/edge";
import Image from "next/image";

export const runtime = "edge";

const Account = async () => {
  const session = await getSession();
  return (
    <div className={"ml-4 flex items-center space-x-2 px-2 rounded"}>
      <div className={"border-2 border-white shadow overflow-hidden p-0.5"}>
        <Image
          src={session?.user.picture}
          width={20}
          height={20}
          alt={""}
          priority={true}
        />
      </div>
      <div className={"truncate"}>
        <div
          className={"text-sm text-gray-800 truncate font-medium select-text"}
        >
          {session?.user.email}
        </div>
      </div>
    </div>
  );
};

export default Account;
