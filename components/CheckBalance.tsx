"use client";
import { useEffect } from "react";
import useSWR from "swr";
import { usePathname, useRouter } from "next/navigation";

const CheckBalance = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: balanceData } = useSWR("/api/dashboard/balance", (url) =>
    fetch(url).then((res) => res.json()),
  );

  useEffect(() => {
    if (!pathname.startsWith("/pay") && balanceData?.balance < -1) {
      router.replace("/pay/error?error=Insufficient balance");
    }
  }, [balanceData?.balance, pathname, router]);

  return null;
};

export default CheckBalance;
