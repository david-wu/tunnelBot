
export function getDateFromStr(dateStr: string) {
  return new Date(dateStr);
}

export function getDateFromLeadingYearStr(dateStr: string) {
  const splitDateStr = dateStr.split('-').map(Number);
  return new Date(
    splitDateStr[0],
    splitDateStr[1] - 1,
    splitDateStr[2],
  );
}
