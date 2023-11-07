export const AI_MODELS_MAP = new Map([
  [
    "gpt-4",
    {
      content: 8 * 1024,
      input_price: 0.03,
      output_price: 0.06,
    },
  ],
  [
    "gpt-4-1106-preview",
    {
      content: 128 * 1024,
      input_price: 0.01,
      output_price: 0.03,
    },
  ],
  [
    "gpt-3.5-turbo",
    {
      content: 16 * 1024,
      input_price: 0.001,
      output_price: 0.002,
    },
  ],
]);
