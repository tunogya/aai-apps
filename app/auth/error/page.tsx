import Image from "next/image";
import Link from "next/link";
export default function Page() {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col bg-gray-50">
      <div className="w-96 flex flex-col justify-center items-center">
        <div className="mb-5">
          <Image src={"/favicon.svg"} alt={""} width={60} height={60} />
        </div>
        <div className="mb-2 text-center text-lg">Oops!</div>
        <div className="mb-5 text-center"></div>
        <Link
          href={"/auth/login"}
          className="flex w-full items-center justify-center gap-2"
        >
          Back
        </Link>
      </div>
    </div>
  );
}
