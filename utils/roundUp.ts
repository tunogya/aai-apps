export function roundUp(num: number, decimals: number): number {
  const pow = Math.pow(10, decimals);
  return Math.ceil(num * pow) / pow;
}
