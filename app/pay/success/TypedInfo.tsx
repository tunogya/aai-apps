"use client";
import { useEffect, useRef } from "react";
import Typed from "typed.js";

export const TypedInfo = () => {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Thanks for using!", "Try it out!"],
      typeSpeed: 50,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  return (
    <div>
      <span ref={el} className={"text-sm text-black font-bold"} />
    </div>
  );
};
