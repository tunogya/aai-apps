"use client";

const HobbiesInput = () => {
  return (
    <textarea
      placeholder={"What are your Persona's preferences?"}
      className={
        "border text-sm overflow-x-scroll max-w-[360px] w-full h-7 px-2 py-1 rounded focus:outline-[#0066FF] min-h-[80px] max-h-[240px]"
      }
    />
  );
};

export default HobbiesInput;
