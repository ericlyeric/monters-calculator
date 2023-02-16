export const convertTextToDecimal = (number: string) => {
  const regex = new RegExp(/[1-9][0-9]*\/[1-9][0-9]*/g);
  if (regex.test(number)) {
    const split = number.split("/");
    return parseInt(split[0], 10) / parseInt(split[1], 10);
  }
  return parseFloat(number);
};

export const roundDecimalPlaces = (value: number, decimals: number) => {
  if (!Number.isFinite(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};
