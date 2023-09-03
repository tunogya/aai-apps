import Image from "next/image";

export default function Page() {
  return (
    <div className="w-full h-full flex bg-white gap-5 relative">
      <div className="absolute top-2 left-2">
        <Image src={"/favicon.svg"} alt={""} width={32} height={32} />
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center py-4 gap-8">
        <div className="text-center text-xl font-medium">
          Sign in to AbandonAI
        </div>
        <a
          href={"/api/auth/login"}
          className="flex px-3 py-3 min-w-[200px] text-white rounded-full items-center justify-center gap-2 bg-gray-500 hover:bg-gray-700 font-medium"
        >
          Sign in
        </a>
      </div>
    </div>
  );
}
