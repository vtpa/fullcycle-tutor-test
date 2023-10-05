export function getRandomId(): string {
  const numero = Math.random() * 1000;
  return `${numero % 1000}`.split(".")[0].padStart(3, "0");
}
