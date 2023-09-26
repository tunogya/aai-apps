"use client";
import { Listbox } from "@headlessui/react";
import { FC, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const models = [
  { id: 1, name: "gpt-3.5-turbo", unavailable: false, description: "" },
  { id: 2, name: "gpt-3.5-16k", unavailable: false, description: "" },
  { id: 3, name: "gpt-4", unavailable: false, description: "" },
  { id: 4, name: "gpt-4-32k", unavailable: true, description: "" },
];

const Toolbar: FC<{ border?: boolean }> = (props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectModel, setSelectModel] = useState(
    models.find((model) => model.name === searchParams.get("model")) ||
      models[0],
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("model", selectModel.name);
    router.replace(`${pathname}?${params.toString()}`);
  }, [selectModel.name]);

  return (
    <div
      className={`h-[60px] w-full flex items-center justify-between px-4 md:px-10 ${
        props.border ? "border-b" : ""
      }`}
    >
      <div className={"lg:w-[240px] xl:w-[300px]"}>
        <input
          placeholder={"Search"}
          className={
            "w-full px-4 py-2 focus:bg-gray-50 hover:bg-gray-50 focus:outline-0 rounded text-sm"
          }
        />
      </div>
      <div className={"text-sm font-semibold flex items-center space-x-3"}>
        <div
          className={
            "flex items-center space-x-2 p-2 rounded cursor-pointer select-none"
          }
        >
          <Listbox value={selectModel} onChange={setSelectModel}>
            <div className="relative mt-1">
              <Listbox.Button
                className={`relative flex items-center gap-2 whitespace-nowrap ${
                  selectModel.id > 2 ? "text-[#AB68FF]" : "text-[#19C37D]"
                }`}
              >
                {selectModel.id <= 2 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="h-4 w-4 transition-colors"
                    width="16"
                    height="16"
                    strokeWidth="2"
                  >
                    <path
                      d="M9.586 1.526A.6.6 0 0 0 8.553 1l-6.8 7.6a.6.6 0 0 0 .447 1h5.258l-1.044 4.874A.6.6 0 0 0 7.447 15l6.8-7.6a.6.6 0 0 0-.447-1H8.542l1.044-4.874Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="h-4 w-4 transition-colors"
                    width="16"
                    height="16"
                    strokeWidth="2"
                  >
                    <path
                      d="M12.784 1.442a.8.8 0 0 0-1.569 0l-.191.953a.8.8 0 0 1-.628.628l-.953.19a.8.8 0 0 0 0 1.57l.953.19a.8.8 0 0 1 .628.629l.19.953a.8.8 0 0 0 1.57 0l.19-.953a.8.8 0 0 1 .629-.628l.953-.19a.8.8 0 0 0 0-1.57l-.953-.19a.8.8 0 0 1-.628-.629l-.19-.953h-.002ZM5.559 4.546a.8.8 0 0 0-1.519 0l-.546 1.64a.8.8 0 0 1-.507.507l-1.64.546a.8.8 0 0 0 0 1.519l1.64.547a.8.8 0 0 1 .507.505l.546 1.641a.8.8 0 0 0 1.519 0l.546-1.64a.8.8 0 0 1 .506-.507l1.641-.546a.8.8 0 0 0 0-1.519l-1.64-.546a.8.8 0 0 1-.507-.506L5.56 4.546Zm5.6 6.4a.8.8 0 0 0-1.519 0l-.147.44a.8.8 0 0 1-.505.507l-.441.146a.8.8 0 0 0 0 1.519l.44.146a.8.8 0 0 1 .507.506l.146.441a.8.8 0 0 0 1.519 0l.147-.44a.8.8 0 0 1 .506-.507l.44-.146a.8.8 0 0 0 0-1.519l-.44-.147a.8.8 0 0 1-.507-.505l-.146-.441Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                )}
                {selectModel.name}
              </Listbox.Button>
              <Listbox.Options
                className={
                  "absolute right-0 mt-2 bg-white rounded px-4 py-2 border shadow z-50 w-44 text-sm space-y-1 text-black"
                }
              >
                {models.map((model) => (
                  <Listbox.Option
                    key={model.id}
                    value={model}
                    disabled={model.unavailable}
                    className={
                      model.unavailable
                        ? "text-white cursor-not-allowed"
                        : "hover:text-purple-600"
                    }
                  >
                    {model.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
        <button className={"hover:bg-gray-50 p-1.5 rounded-full text-black"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
