const getUnixTime = (date: Date): number => Math.round(date.getTime() / 1000);

export default getUnixTime;
