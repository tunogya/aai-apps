import { NextRequest, NextResponse } from "next/server";

type MODEL_STATUS = {
  window_start: string;
  model: string;
  total_requests: number;
  q_75: number;
  q_90: number;
  q_95: number;
  q_99: number;
  total_errors: number;
  error_rate: number;
  color: string;
  tps: number;
};

const GET = async (req: NextRequest) => {
  // return <MODEL_STATUS[]>
  return NextResponse.json([
    {
      window_start: "2023-09-26 02:00:00",
      model: "openai:gpt-3.5-turbo",
      total_requests: 426,
      q_75: 1449.25,
      q_90: 1774.5,
      q_95: 1918.25,
      q_99: 2256,
      total_errors: 310,
      error_rate: 72.7699530516432,
      color: "red",
      tps: 13,
    },
  ]);
};

export { GET };
