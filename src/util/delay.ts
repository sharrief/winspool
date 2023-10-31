export default function delay(ms: number) {
  return new Promise((resolve) => { resolve(setTimeout(resolve, ms)); });
}
