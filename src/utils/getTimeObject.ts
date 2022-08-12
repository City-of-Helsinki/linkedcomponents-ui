import { TimeObject } from '../types';

const getTimeObject = (time: string): TimeObject => {
  const hours = Number(time.replace(':', '.').split('.')[0]);
  const minutes = Number(time.replace(':', '.').split('.')[1]);

  return {
    hours: Number.isInteger(hours) && hours < 24 && hours >= 0 ? hours : 0,
    minutes:
      Number.isInteger(minutes) && minutes < 60 && minutes >= 0 ? minutes : 0,
  };
};

export default getTimeObject;
