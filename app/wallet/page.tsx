import { getSession } from "@auth0/nextjs-auth0/edge";
import LoginView from "@/app/wallet/LoginView";
import NormalView from "@/app/wallet/NormalView";

export const runtime = "edge";

const Wallet = async () => {
  const session = await getSession();

  return (
    <div
      className={
        "flex flex-col justify-center items-center h-full w-full md:p-12"
      }
    >
      <div
        className={
          "max-w-md w-full bg-[#181818] p-4 md:p-6 rounded-lg h-full overflow-scroll"
        }
      >
        {!session?.user ? <LoginView /> : <NormalView />}
      </div>
    </div>
  );
};

export default Wallet;
