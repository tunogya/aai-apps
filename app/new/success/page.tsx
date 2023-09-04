import Link from "next/link";

const Success = () => {
  return (
    <div
      className={
        "flex flex-col h-full w-full items-center justify-center space-y-4"
      }
    >
      <div className={"text-2xl"}>Success!</div>
      <Link href={"/persona"} className={"underline"}>
        Back
      </Link>
    </div>
  );
};

export default Success;
