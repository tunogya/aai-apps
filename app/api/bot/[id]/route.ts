import { NextRequest, NextResponse } from "next/server";
import redisClient from "@/app/utils/redisClient";

const POST = async (req: NextRequest, { params }: any) => {
  const body = await req.json();
  console.log(body);
  // {
  //   update_id: 56707101,
  //   message: {
  //     message_id: 19,
  //     from: {
  //       id: 2130493951,
  //       is_bot: false,
  //       first_name: 'Tom',
  //       username: 'tunogya',
  //       language_code: 'zh-hans'
  //     },
  //     chat: {
  //       id: 2130493951,
  //       first_name: 'Tom',
  //       username: 'tunogya',
  //       type: 'private'
  //     },
  //     date: 1701514816,
  //     text: 'Hello'
  //   }
  // }

  // {
  //   update_id: 56707102,
  //   message: {
  //     message_id: 20,
  //     from: {
  //       id: 2130493951,
  //       is_bot: false,
  //       first_name: 'Tom',
  //       username: 'tunogya',
  //       language_code: 'zh-hans'
  //     },
  //     chat: {
  //       id: 2130493951,
  //       first_name: 'Tom',
  //       username: 'tunogya',
  //       type: 'private'
  //     },
  //     date: 1701515016,
  //     voice: {
  //       duration: 3,
  //       mime_type: 'audio/ogg',
  //       file_id: 'AwACAgUAAxkBAAMUZWsPCKlWz3vNnR-sP2mhFHwPe8UAAsUNAALPjVhXCLadXiKW2GQzBA',
  //       file_unique_id: 'AgADxQ0AAs-NWFc',
  //       file_size: 9747
  //     }
  //   }
  // }

  // 获取当前机器人的 token
  const token = params.id;
  // 通过机器人的 token 获取 assistant_id
  const assistant_id = await redisClient.get(`${token}:assistant_id`);
  if (!assistant_id) {
    return NextResponse.json(
      { message: "assistant_id not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      message: "hello",
    },
    {
      status: 200,
    },
  );
};

export { POST };
