export const convertTextToDecimal = (number: string) => {
  const regex = new RegExp(/[1-9][0-9]*\/[1-9][0-9]*/g);
  if (regex.test(number)) {
    const split = number.split("/");
    return parseInt(split[0], 10) / parseInt(split[1], 10);
  }
  return parseFloat(number);
};
