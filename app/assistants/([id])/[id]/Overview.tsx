"use client";

const CSRPage = () => {
  return (
    <div className={"space-y-6 pt-4"}>
      <div>
        <div className={"flex justify-between items-center pb-3 border-b"}>
          <div className={"font-semibold text-gray-800"}>Telegram Bots</div>
          <button
            disabled
            className={
              "text-sm text-[#0066FF] disabled:cursor-auto disabled:opacity-50"
            }
          >
            Add
          </button>
        </div>
        <div className={"pt-3 text-sm text-gray-500"}>No Bots</div>
      </div>
    </div>
  );
};

export default CSRPage;
