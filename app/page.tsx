"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import dysortid from "@/app/utils/dysortid";
import useSWR from "swr";

export default function Index() {
  const { user, error, isLoading } = useUser();
  useSWR("/api/customer", (url) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data),
  );

  if (isLoading) return <div></div>;

  if (error) return redirect(`/auth/error?message=${error.message}`);

  if (user) return redirect(`/chat/${dysortid()}`);

  return redirect("/auth/login");
}
