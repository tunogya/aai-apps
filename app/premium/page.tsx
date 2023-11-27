"use client";

import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { MinusSmallIcon } from "@heroicons/react/24/outline";
import SubscribeButton from "@/app/components/SubscribeButton";
import Link from "next/link";

const CSR = () => {
  return (
    <div
      className={
        "px-4 md:px-10 md:pt-2 absolute h-[calc(100vh-60px)] w-full overflow-y-auto space-y-6 pb-28"
      }
    >
      <div
        className={
          "flex flex-col space-y-10 w-full pt-4 pb-2 text-gray-800 items-center"
        }
      >
        <div>
          <div className={"text-[40px] font-semibold text-gray-800"}>
            Experience the difference
          </div>
          <div className={"text-2xl max-w-md text-center text-gray-600"}>
            Enjoy ad-free ChatGPT, Assistants, and more. Cancel anytime.
          </div>
        </div>

        <table className="table-auto">
          <thead>
            <tr className={"h-28 border-b"}>
              <th className={"flex h-28 items-end p-3 w-52"}>
                What you&apos;ll get
              </th>
              <th className={"text-start p-3 w-52 bg-gray-50"}>
                AbandonAI&apos;s
                <br />
                Free plan
              </th>
              <th
                className={
                  "text-start p-3 w-52 bg-gradient-to-b from-[#4233cc] to-[#5633cc] text-white"
                }
              >
                AbandonAI&apos;s
                <br />
                Premium plans
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className={"border-b"}>
              <td className={"px-3 py-4"}>Ad-free</td>
              <td className={"px-3 py-4 bg-gray-50"}>
                <MinusSmallIcon className={"w-8 h-8"} />
              </td>
              <td
                className={
                  "px-3 py-4 bg-gradient-to-b from-[#5633cc] to-[#6933cb] text-white"
                }
              >
                <CheckCircleIcon className={"w-8 h-8"} />
              </td>
            </tr>
            <tr className={"border-b"}>
              <td className={"px-3 py-4"}>ChatGPT</td>
              <td className={"px-3 py-4 bg-gray-50"}>gpt-3.5-turbo</td>
              <td
                className={
                  "px-3 py-4 bg-gradient-to-b from-[#6933cb] to-[#7d33cb] text-white"
                }
              >
                gpt-4-1106-preview,
                <br />
                gpt-3.5-turbo-16k,
                <br />
                ...
              </td>
            </tr>
            <tr className={"border-b"}>
              <td className={"px-3 py-4"}>Tools</td>
              <td className={"px-3 py-4 bg-gray-50"}>Code Interpreter</td>
              <td
                className={
                  "px-3 py-4 bg-gradient-to-b from-[#7d33cb] to-[#9133ca] text-white"
                }
              >
                DALL·E 3,
                <br />
                Google Search,
                <br />
                Code Interpreter,
                <br />
                ...
              </td>
            </tr>
            <tr className={"border-b"}>
              <td className={"px-3 py-4"}>Voice</td>
              <td className={"px-3 py-4 bg-gray-50"}>
                <MinusSmallIcon className={"w-8 h-8"} />
              </td>
              <td
                className={
                  "px-3 py-4 bg-gradient-to-b from-[#9133ca] to-[#a533ca] text-white"
                }
              >
                <CheckCircleIcon className={"w-8 h-8"} />
              </td>
            </tr>
            <tr className={"border-b"}>
              <td className={"px-3 py-4"}>Whisper</td>
              <td className={"px-3 py-4 bg-gray-50"}>
                <MinusSmallIcon className={"w-8 h-8"} />
              </td>
              <td
                className={
                  "px-3 py-4 bg-gradient-to-b from-[#a533ca] to-[#b833c9] text-white"
                }
              >
                <CheckCircleIcon className={"w-8 h-8"} />
              </td>
            </tr>
            <tr className={"border-b"}>
              <td className={"px-3 py-4"}>Assistants</td>
              <td className={"px-3 py-4 bg-gray-50"}>
                <MinusSmallIcon className={"w-8 h-8 "} />
              </td>
              <td
                className={
                  "px-3 py-4 bg-gradient-to-b from-[#b833c9] to-[#cc33c9] text-white"
                }
              >
                <CheckCircleIcon className={"w-8 h-8"} />
              </td>
            </tr>
          </tbody>
        </table>
        <div
          className={"flex flex-col pt-10 items-center text-center space-y-2"}
        >
          <div className={"text-3xl font-semibold"}>
            Affordable plans for any situation
          </div>
          <div className={"text-gray-500 max-w-[600px]"}>
            Choose a Premium plan and use ChatGPT and Assistants without limits.
            Pay in various ways. Cancel anytime.
          </div>
        </div>
        <div
          className={
            "p-4 border-4 border-yellow-500 w-96 flex flex-col items-center rounded-lg"
          }
        >
          <div className={"flex justify-between w-full"}>
            <div className={"text-2xl font-medium"}>Premium Standard</div>
            <div className={"flex flex-col items-center"}>
              <div className={"text-lg font-bold"}>$20.00</div>
              <div className={"text-[10px]"}>PER MONTH</div>
            </div>
          </div>
          <div className={"text-start w-full pt-20 font-medium"}>
            <li>1 Premium account</li>
            <li>Cancel anytime</li>
          </div>

          <div className={"w-full pt-20"}>
            <SubscribeButton />
          </div>
          <div className={"h-10"}>
            <Link
              href={"https://www.abandon.ai/docs/policies/Legal/terms-of-use"}
              target={"_blank"}
              className={"text-xs pt-2 underline text-gray-500"}
            >
              Terms and conditions apply.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSR;
