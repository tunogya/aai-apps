export const runtime = "edge";
const SecondaryNav = () => {
  return (
    <div
      className={
        "w-[300px] shrink-0 h-full border-r overflow-y-auto flex flex-col"
      }
    >
      <div
        className={
          "flex items-center border hover:bg-stone-100 p-3 rounded cursor-pointer select-none m-2"
        }
      >
        <div className={"w-6 shrink-0"}>
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <div className={"text-sm"}>New Notebook</div>
      </div>
      <div className={"h-full overflow-y-auto pl-2 pr-4"}>
        <div
          className={
            "flex w-full items-center hover:bg-stone-100 px-3 py-2 rounded cursor-pointer select-none"
          }
        >
          <div className={"truncate text-sm"}>A</div>
        </div>
      </div>
    </div>
  );
};

export default SecondaryNav;
