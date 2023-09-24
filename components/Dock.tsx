const Dock = () => {
  return (
    <div
      className={
        "absolute right-0 top-0 h-full w-10 border-l flex-col items-center justify-center space-y-4 shrink-0 bg-white z-10 hidden md:flex"
      }
    >
      <div
        className={
          "h-8 w-8 rounded-full border flex items-center justify-center text-sm"
        }
      >
        T
      </div>
    </div>
  );
};

export default Dock;
