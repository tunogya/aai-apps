"use client";
import useSWR from "swr";

const SubscriptionCheck = () => {
  const { data: customer, isLoading: isCustomerLoading } = useSWR(
    "/api/customer",
    (url) => fetch(url).then((res) => res.json()),
  );
  const { data: subscription, isLoading: isSubscriptionLoading } = useSWR(
    "/api/subscription",
    (url) => fetch(url).then((res) => res.json()),
  );

  return <></>;
};

export default SubscriptionCheck;
