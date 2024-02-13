import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

// No need to use Redis
const GET = async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;

  return NextResponse.json([
    {
      name: "Characters",
      image: "",
      color: "",
    },
    {
      name: "Games",
      image: "",
      color: "",
    },
    {
      name: "Learning Assistant",
      image: "",
      color: "",
    },
    {
      name: "Leisure & Entertainment",
      image: "",
      color: "",
    },
    {
      name: "Consultation",
      image: "",
      color: "",
    },
    {
      name: "Business Assistant",
      image: "",
      color: "",
    },
    {
      name: "Text Comprehension & Creation",
      image: "",
      color: "",
    },
    {
      name: "Translation",
      image: "",
      color: "",
    },
    {
      name: "Image-based",
      image: "",
      color: "",
    },
    {
      name: "Video-based",
      image: "",
      color: "",
    },
    {
      name: "Audio-based",
      image: "",
      color: "",
    },
    {
      name: "Productivity Tools",
      image: "",
      color: "",
    },
  ]);
};

export { GET };
