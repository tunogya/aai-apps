"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import dysortid from "@/app/utils/dysortid";
import Image from "next/image";

export default function Index() {
  const { user, error, isLoading } = useUser();

  if (isLoading)
    return (
      <div
        className={
          "w-full h-full flex flex-col items-center justify-center gap-3"
        }
      >
        <div className={"p-3 border rounded-full"}>
          <Image src={"/favicon.svg"} alt={""} height={40} width={40} />
        </div>
        <div className={"text-xl md:text-2xl lg:text-3xl text-gray-800"}>
          abandon.ai
        </div>
      </div>
    );

  if (error) return redirect(`/auth/error?message=${error.message}`);

  if (user) return redirect(`/chat/${dysortid()}`);

  return redirect("/auth/login");
}
