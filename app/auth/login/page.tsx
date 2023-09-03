import Image from "next/image";

export default function Page() {
  return (
    <div className="w-full h-full flex bg-white">
      <div className="w-full h-full flex flex-col justify-center items-center py-4">
        <div className="mb-5">
          <Image src={"/favicon.svg"} alt={""} width={40} height={40} />
        </div>
        <div className="mb-5 text-center"></div>
        <a
          href={"/api/auth/login"}
          className="flex px-3 py-2 rounded items-center justify-center gap-2 bg-gray-200 font-medium"
        >
          Continue to Abandon AI
        </a>
      </div>
    </div>
  );
}
