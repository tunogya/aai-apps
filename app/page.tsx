"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import dysortid from "@/app/utils/dysortid";
import useSWR from "swr";

export default function Index() {
  const { user, error, isLoading } = useUser();
  const { data: customer, isLoading: isCustomerLoading } = useSWR(
    "/api/customer",
    (url) => fetch(url).then((res) => res.json()),
  );
  const { data: subscription, isLoading: isSubscriptionLoading } = useSWR(
    "/api/subscription",
    (url) => fetch(url).then((res) => res.json()),
  );

  console.log(subscription);

  if (isLoading || isCustomerLoading || isSubscriptionLoading)
    return (
      <div
        className={
          "w-full h-full flex flex-col items-center justify-center gap-3 animate-pulse text-gray-800"
        }
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 1024 1024"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M68 68V956H956V68H68ZM142 882V142H586V413.333L512 216H438L216 808H290L345.5 660H586V882H142ZM576.791 586H373.209L475 314.667L576.791 586Z"
            fill="currentColor"
          />
        </svg>
      </div>
    );

  if (error) return redirect(`/auth/error?message=${error.message}`);

  if (user && customer && subscription) return redirect(`/chat/${dysortid()}`);

  return redirect("/auth/login");
}
