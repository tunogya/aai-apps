"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Tab } from "@headlessui/react";
import SubscribeButton from "@/app/components/SubscribeButton";
import CheckoutButton from "@/app/components/CheckoutButton";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const CSR = () => {
  const { data, isLoading } = useSWR("/api/customer", (url) =>
    fetch(url).then((res) => res.json()),
  );
  const [category] = useState({
    "One-time": [
      {
        recommended: false,
        name: "AbandonAI Free",
        priceId: process.env.NEXT_PUBLIC_ONETIME_FREE_PRICE,
        productId: process.env.NEXT_PUBLIC_FREE_PRODUCT,
        price: "0",
        button: "Free",
        type: "one-time",
        features: [
          "GPT-3.5: Up to 5 messages per 15-min",
          "Code interpreter, Fetch urls",
        ],
      },
      {
        recommended: true,
        name: "AbandonAI Premium Pro",
        priceId: process.env.NEXT_PUBLIC_ONETIME_PREMIUM_PRO_PRICE,
        productId: process.env.NEXT_PUBLIC_PREMIUM_PRO_PRODUCT,
        price: "49",
        button: "Pay",
        type: "one-time",
        features: [
          "GPT-4: Up to 50 messages per 6-hour",
          "DALL·E 3: Up to 20 draws per hour",
          "Browse, create, and use Assistants",
        ],
      },
      {
        name: "AbandonAI Premium Max",
        priceId: process.env.NEXT_PUBLIC_ONETIME_PREMIUM_MAX_PRICE,
        productId: process.env.NEXT_PUBLIC_PREMIUM_MAX_PRODUCT,
        price: "89",
        button: "Pay",
        type: "one-time",
        features: [
          "GPT-4: Up to 50 messages per 3-hour",
          "DALL·E 3: Up to 40 draws per hour",
          "Browse, create, and use Assistants",
        ],
      },
    ],
    Monthly: [
      {
        recommended: false,
        name: "AbandonAI Free",
        priceId: process.env.NEXT_PUBLIC_MONTHLY_FREE_PRICE,
        productId: process.env.NEXT_PUBLIC_FREE_PRODUCT,
        price: "0",
        button: "Free",
        type: "subscribe",
        features: [
          "GPT-3.5: Up to 5 messages per 15-min",
          "Code interpreter, Fetch urls",
        ],
      },
      {
        recommended: true,
        name: "AbandonAI Premium Pro",
        priceId: process.env.NEXT_PUBLIC_MONTHLY_PREMIUM_PRO_PRICE,
        productId: process.env.NEXT_PUBLIC_PREMIUM_PRO_PRODUCT,
        price: "45",
        button: "Subscribe",
        type: "subscribe",
        features: [
          "GPT-4: Up to 50 messages per 6-hour",
          "DALL·E 3: Up to 20 draws per hour",
          "Browse, create, and use Assistants",
        ],
      },
      {
        name: "AbandonAI Premium Max",
        priceId: process.env.NEXT_PUBLIC_MONTHLY_PREMIUM_MAX_PRICE,
        productId: process.env.NEXT_PUBLIC_PREMIUM_MAX_PRODUCT,
        price: "85",
        button: "Subscribe",
        type: "subscribe",
        features: [
          "GPT-4: Up to 50 messages per 3-hour",
          "DALL·E 3: Up to 40 draws per hour",
          "Browse, create, and use Assistants",
        ],
      },
    ],
  });

  if (isLoading || !data?.customer.email) {
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
  }

  return (
    <div
      className={
        "w-full h-full md:h-[calc(100vh-60px)] p-2 md:p-4 relative flex flex-col space-y-4 overflow-y-auto"
      }
    >
      <div
        className={
          "p-2 md:px-8 md:py-12 md:border rounded-lg space-y-4 xl:space-y-8"
        }
      >
        <div className={"text-2xl xl:text-3xl font-semibold text-center"}>
          Affordable plans for any situation
        </div>
        <div className={"pt-8 flex flex-col w-full items-center"}>
          <Tab.Group>
            <Tab.List className={"flex space-x-1 rounded-xl bg-gray-100 p-1"}>
              {Object.keys(category).map((item) => (
                <Tab
                  key={item}
                  className={({ selected }) =>
                    classNames(
                      "w-full rounded-lg py-2 text-sm font-medium leading-5 whitespace-nowrap px-8",
                      "ring-0 focus:outline-none",
                      selected
                        ? "bg-white text-[#0066FF] shadow"
                        : "text-gray-600 hover:bg-white/[0.12] hover:text-gray-800",
                    )
                  }
                >
                  {item}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className={"mt-8"}>
              {Object.values(category).map((item, index) => (
                <Tab.Panel key={index}>
                  <div
                    className={
                      "grid grid-cols-1 xl:grid-cols-3 gap-2 justify-center w-fit"
                    }
                  >
                    {item.map((item, i) => (
                      <div
                        className={`p-9 rounded-lg relative ${
                          item?.recommended ? "bg-gray-100 border" : ""
                        }`}
                        key={i}
                      >
                        {data.subscription.type === item.type &&
                          data.subscription?.product === item.productId && (
                            <div
                              className={
                                "text-xs text-gray-500 mt-2 absolute top-2 left-9 underline"
                              }
                            >
                              You will be expired at:{" "}
                              {new Date(
                                data.subscription?.current_period_end * 1000,
                              ).toLocaleDateString()}
                            </div>
                          )}
                        <div className={`w-60`}>
                          <div
                            className={`text-xs text-gray-800 bg-white w-fit px-2 py-0.5 rounded-lg mb-2 ${
                              item?.recommended
                                ? "opacity-100 animate-pulse"
                                : "opacity-0"
                            }`}
                          >
                            Recommended
                          </div>
                          <div
                            className={
                              "text-xl font-medium h-[58px] text-gray-800"
                            }
                          >
                            {item.name}
                          </div>
                          <div
                            className={
                              "text-4xl font-bold h-[58px] text-gray-800 mt-10"
                            }
                          >
                            CN¥{item.price}
                          </div>
                          {item.type === "one-time" ? (
                            <CheckoutButton
                              price={item.priceId!}
                              title={
                                data.subscription.type === "one-time" &&
                                data.subscription?.product === item.productId
                                  ? `Current plan`
                                  : item.button
                              }
                              className={
                                "w-full bg-[#0066FF] text-white py-3 rounded-lg disabled:bg-gray-300 disabled:cursor-default"
                              }
                            />
                          ) : (
                            <SubscribeButton
                              price={item.priceId!}
                              title={item.button}
                              className={
                                "w-full bg-[#0066FF] text-white py-3 rounded-lg disabled:bg-gray-300 disabled:cursor-default"
                              }
                            />
                          )}
                          <div className={"my-3 text-sm text-gray-700"}>
                            This includes:
                          </div>
                          <div className={"text-sm text-gray-700"}>
                            {item.features.map((feature, index) => (
                              <div key={index} className={"h-12 flex gap-2"}>
                                <CheckCircleIcon
                                  className={"w-5 h-5 text-gray-400"}
                                />
                                <div>{feature}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default CSR;
