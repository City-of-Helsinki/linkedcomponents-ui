export const selectRandomValueFromArray = <T>(array: Array<T>): T =>
  selectRandomValuesFromArray(array, 1)[0];

export const selectRandomValuesFromArray = <T>(
  array: Array<T>,
  amount: number
): Array<T> => {
  const shuffled = array.sort(randomCompareFn);
  const index = amount < array.length ? amount : array.length;
  return shuffled.slice(0, index);
};

const randomCompareFn = () => 0.5 - Math.random();

export const splitBySentences = (text: string): string[] =>
  replaceHtmlTags(text)
    .split(/(<[^>]*>|[.,!?()\r\n])/g)
    .map((s) => s.trim())
    .filter((s) => /[^.,!?()\r\n]+/.test(s));

export const replaceHtmlTags = (text: string, replacer = '.'): string =>
  text.replace(/<\/?[^>]+(>|$)/g, replacer);

export const getRandomSentence = (text: string): string => {
  return selectRandomValueFromArray(splitBySentences(text));
};
