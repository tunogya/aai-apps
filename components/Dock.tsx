const Dock = () => {
  return (
    <div
      className={
        "absolute right-0 top-0 h-full w-10 border-l flex flex-col items-center justify-center space-y-6"
      }
    >
      <div className={"h-6 w-6 bg-red-500 rounded"}>1</div>
      <div className={"h-6 w-6 bg-red-500 rounded"}>2</div>
    </div>
  );
};

export default Dock;
