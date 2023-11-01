export function getNowInMs() {
  return (new Date()).valueOf();
}

export function getYesterdayInMs() {
  const oneDayInMs = 1000 * 60 * 60 * 24;
  const yesterday = new Date(exports.getToday().valueOf() - oneDayInMs);
  return yesterday.valueOf();
}
