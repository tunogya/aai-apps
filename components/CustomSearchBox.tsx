import React, { useState, useRef } from "react";
import {
  useInstantSearch,
  useSearchBox,
  UseSearchBoxProps,
} from "react-instantsearch";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

function CustomSearchBox(props: UseSearchBoxProps) {
  const { query, refine } = useSearchBox(props);
  const { status } = useInstantSearch();
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  function setQuery(newQuery: string) {
    setInputValue(newQuery);

    refine(newQuery);
  }
  console.log(status);

  return (
    <div
      className={`w-[360px] h-10 hover:bg-gray-50 rounded text-sm ${
        query && "bg-gray-50"
      }`}
    >
      <form
        action=""
        role="search"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();

          if (inputRef.current) {
            inputRef.current.blur();
          }
        }}
        onReset={(event) => {
          event.preventDefault();
          event.stopPropagation();

          setQuery("");

          if (inputRef.current) {
            inputRef.current.focus();
          }
        }}
        className={"w-full h-full px-4 py-2 flex gap-2 items-center"}
      >
        {status === "error" && (
          <ExclamationTriangleIcon
            className={"w-4 h-4 text-red-500 stroke-2"}
          />
        )}
        {status === "loading" && (
          <ArrowPathIcon
            className={"w-4 h-4 text-gray-500 animate-spin stroke-2"}
          />
        )}
        {(status === "idle" || status === "stalled") && (
          <MagnifyingGlassIcon className={"w-4 h-4 text-gray-500 stroke-2"} />
        )}
        <input
          ref={inputRef}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Search"
          spellCheck={false}
          maxLength={512}
          value={inputValue}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
          }}
          autoFocus={false}
          className={"w-full h-full outline-none bg-transparent"}
        />
      </form>
    </div>
  );
}

export default CustomSearchBox;
