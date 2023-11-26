"use client";

const CSRPage = () => {
  return (
    <div className={"space-y-6"}>
      <div>
        <div className={"flex justify-between items-center pt-4 pb-3 border-b"}>
          <div className={"font-semibold text-gray-800"}>Telegram Bots</div>
          <button className={"text-sm text-[#0066FF]"}>Add</button>
        </div>

        <div className={"pt-3 text-sm text-gray-500"}>No Bots</div>
      </div>
    </div>
  );
};

export default CSRPage;
