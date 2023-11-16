"use client";
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
import { XMarkIcon } from "@heroicons/react/24/solid";

function CustomSearchBox(props: UseSearchBoxProps) {
  const { query, refine, clear } = useSearchBox(props);
  const { status } = useInstantSearch();
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  function setQuery(newQuery: string) {
    setInputValue(newQuery);
  }

  return (
    <div
      className={`h-10 w-[300px] hover:bg-gray-100 hover:w-full rounded text-sm transition-all duration-300 ease-in-out ${
        inputValue && "bg-gray-100 w-full"
      }`}
    >
      <div className={"w-full h-full px-4 py-2 flex gap-2 items-center"}>
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
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              if (e.nativeEvent.isComposing) return;
              e.preventDefault();
              if (e.currentTarget.value.length > 0) {
                refine(e.currentTarget.value);
              } else {
                clear();
              }
            }
          }}
          autoFocus={false}
          className={"w-full h-full outline-none bg-transparent"}
        />
        {inputValue && (
          <button
            onClick={() => {
              setInputValue("");
              clear();
            }}
            className={"p-1 bg-gray-200 hover:bg-gray-300 rounded"}
          >
            <XMarkIcon className={"w-4 h-4 stroke-2 text-gray-500"} />
          </button>
        )}
      </div>
    </div>
  );
}

export default CustomSearchBox;
