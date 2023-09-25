"use client";
import { useEffect, useRef } from "react";
import Typed from "typed.js";

export const TypedInfo = () => {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["If you change your mind,", "can be deposited at any time."],
      typeSpeed: 50,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  return (
    <div>
      <span ref={el} className={"text-sm text-gary-800 font-bold"} />
    </div>
  );
};
