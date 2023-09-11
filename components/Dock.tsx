import Image from "next/image";

const Dock = () => {
  return (
    <div
      className={
        "absolute right-0 top-0 h-full w-10 border-l flex flex-col items-center justify-center space-y-4 shrink-0 bg-white z-10"
      }
    >
      <div
        className={
          "h-8 w-8 rounded-full overflow-hidden border-2 border-white shadow"
        }
      >
        <Image
          src={`https://www.gravatar.com/avatar/1?s=200&d=monsterid`}
          width={32}
          height={32}
          alt={""}
        />
      </div>
    </div>
  );
};

export default Dock;
