"use client";

const Tools = () => {
  return (
    <div className={"space-y-4 text-gray-800"}>
      <div className={"text-xs font-medium text-gray-500"}>Tools</div>
      <div>
        <div className={"text-sm font-medium border-t py-2"}>
          <div>Function</div>
        </div>
        <div className={"text-sm font-medium border-t py-2 flex gap-2"}>
          <input
            type={"checkbox"}
            id={"code-interpreter"}
            className={"cursor-pointer accent-[#0066FF]"}
          />
          <label htmlFor={"code-interpreter"} className={"cursor-pointer"}>
            Code interpreter
          </label>
        </div>
        <div className={"text-sm font-medium border-t py-2 flex gap-2"}>
          <input
            type={"checkbox"}
            id={"retrieval"}
            className={"cursor-pointer accent-[#0066FF]"}
          />
          <label htmlFor={"retrieval"} className={"cursor-pointer"}>
            Retrieval
          </label>
        </div>
        <div>
          <div className={"text-xs font-medium border-y py-4 text-gray-400"}>
            FILES
          </div>
          <div className={"text-gray-400 text-sm py-2"}>
            Add files to use with code interpreter or retrieval.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
