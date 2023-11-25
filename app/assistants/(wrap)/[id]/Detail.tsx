"use client";

const CSRPage = () => {
  return (
    <div className={""}>
      <div className={"space-y-1"}>
        <div className={"text-3xl font-medium text-gray-800"}>Name</div>
        <div className={"text-gray-500"}>Model</div>
      </div>
      <div className={"space-y-3"}>
        <div className={"flex justify-between mt-16 pb-3 border-b"}>
          <div className={"text-gray-800 font-semibold"}>Detail</div>
          <button className={"text-sm text-[#0066FF] font-medium"}>Edit</button>
        </div>
        <div>
          <div className={"text-sm text-gray-500"}>Assistant ID</div>
          <div className={"text-sm text-gray-600"}>ID</div>
        </div>
        <div>
          <div className={"text-sm text-gray-500"}>Instructions</div>
          <div className={"text-sm text-gray-600"}>Instructions</div>
        </div>
        <div>
          <div className={"text-sm text-gray-500"}>Voice</div>
          <div className={"text-sm text-gray-600"}>voice</div>
        </div>
      </div>
    </div>
  );
};

export default CSRPage;
