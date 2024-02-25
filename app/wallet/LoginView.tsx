"use client";

import React from "react";
import TheFooter from "@/app/components/TheFooter";

const LoginView = () => {
  return (
    <div className={"flex flex-col justify-center items-center h-full gap-20"}>
      <div className={"flex flex-row items-center space-x-3 py-20"}>
        <div className={"h-12 w-12 text-white"}>
          <svg
            viewBox="0 0 1024 1024"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M68 68V956H956V68H68ZM142 882V142H586V413.333L512 216H438L216 808H290L345.5 660H586V882H142ZM576.791 586H373.209L475 314.667L576.791 586Z"
              fill="white"
            />
          </svg>
        </div>
        <div className={"text-white text-3xl"}>AbandonAI</div>
      </div>
      <a
        href={"/api/auth/login?returnTo=" + window.location.pathname}
        className="flex px-3 py-3 w-full text-white rounded items-center justify-center gap-2 font-medium border-white border-2"
      >
        Sign in
      </a>
    </div>
  );
};

export default LoginView;
