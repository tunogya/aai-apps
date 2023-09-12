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
          <div className={"w-6 shrink-0"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <div className={"truncate text-sm"}>A</div>
        </div>
        <div
          className={
            "flex w-full items-center hover:bg-stone-100 px-3 py-2 rounded cursor-pointer select-none"
          }
        >
          <div className={"w-6 shrink-0"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <div className={"truncate text-sm"}>A</div>
        </div>
      </div>
    </div>
  );
};

export default SecondaryNav;
