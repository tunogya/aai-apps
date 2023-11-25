"use client";
import { useRouter } from "next/navigation";
import { nanoid } from "ai";

const ActionButtonGroup = () => {
  const router = useRouter();

  const create = async () => {
    const name = sessionStorage.getItem("create-assistant-name");
    const voice = sessionStorage.getItem("create-assistant-voice");
    const instructions = sessionStorage.getItem(
      "create-assistant-instructions",
    );
    const model = sessionStorage.getItem("create-assistant-model");
    const telegram_bot_token = sessionStorage.getItem(
      "create-assistant-tg-token",
    );

    if (!name || !voice || !instructions || !model || !telegram_bot_token) {
      return;
    }

    const assistant_id = nanoid();

    try {
      const result = await fetch(`/api/assistants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistant_id,
          name,
          instructions,
          voice: JSON.parse(voice).name.toLowerCase(),
          model: JSON.parse(model).name.toLowerCase(),
          telegram_bot_token,
        }),
      }).then((res) => res.json());
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={"flex items-center gap-3"}>
      <button
        className={
          "px-2 py-1 rounded-lg text-gray-800 border cursor-pointer font-medium"
        }
        onClick={() => {
          sessionStorage.removeItem("create-assistant-name");
          sessionStorage.removeItem("create-assistant-voice");
          sessionStorage.removeItem("create-assistant-instructions");
          sessionStorage.removeItem("create-assistant-model");
          sessionStorage.removeItem("create-assistant-tg-token");
          router.back();
        }}
      >
        Cancel
      </button>
      <button
        onClick={create}
        className={
          "bg-[#0066FF] px-2 py-1 rounded-lg text-white disabled:cursor-auto cursor-pointer font-medium"
        }
      >
        Create
      </button>
    </div>
  );
};

export default ActionButtonGroup;
