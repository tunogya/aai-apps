import Link from "next/link";

export const runtime = "edge";

const Dock = () => {
  return (
    <div
      className={
        "absolute right-0 top-0 h-full w-10 border-l flex-col items-center justify-center space-y-4 shrink-0 bg-white z-10 hidden md:flex"
      }
    >
      <Link
        href={"/kemgoz"}
        prefetch
        className={
          "h-8 w-8 rounded border flex items-center justify-center text-sm hover:shadow hover:bg-gray-100"
        }
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 512 290"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M59.5 89L124 165.5M133 38L192.5 135M261 0.5V123M367.5 18.5L325.5 135M443 58.5L388.5 162.5"
            stroke="currentColor"
            strokeWidth="10"
          />
          <path
            d="M70.5 209C93.6667 183.333 168.2 125.299 257 126.499C345.8 127.699 415 179.999 438.5 205.999"
            stroke="currentColor"
            strokeWidth="10"
          />
          <path
            d="M5.00011 139.5C41.5001 189 142 289 279 282C423 267 488.833 154.167 507 113"
            stroke="currentColor"
            strokeWidth="10"
          />
          <circle
            cx="252.5"
            cy="203.5"
            r="63.5"
            stroke="currentColor"
            strokeWidth="10"
          />
          <circle cx="253" cy="205" r="49" fill="#009DFF" />
          <circle cx="257.5" cy="204.5" r="11.5" fill="currentColor" />
        </svg>
      </Link>
    </div>
  );
};

export default Dock;
