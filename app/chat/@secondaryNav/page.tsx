export const runtime = "edge";
const SecondaryNav = () => {
  return (
    <div className={"w-full p-4 flex flex-col gap-4"}>
      <div
        className={
          "flex gap-2 items-center border hover:bg-gray-100 px-3 py-2 rounded cursor-pointer select-none"
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
        <div>New Chat</div>
      </div>
      <div className={"h-full w-full"}>
        <div
          className={
            "flex w-full items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded cursor-pointer select-none"
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div className={"truncate"}>Hellodncnvlsnvms;dmlm;mw;fmwvvfm,s</div>
        </div>
        <div
          className={
            "flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded cursor-pointer select-none"
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div>Hello</div>
        </div>
      </div>
    </div>
  );
};

export default SecondaryNav;
