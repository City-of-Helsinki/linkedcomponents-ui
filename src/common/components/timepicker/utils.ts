import { TimeObject } from './types';

export const formatTime = ({ hours, minutes }: TimeObject): string => {
  const hour = hours.toString().padStart(2, '0');
  const minute = minutes.toString().padStart(2, '0');
  return `${hour}.${minute}`;
};

export const getTimes = (interval: number): string[] => {
  const times = [];

  for (let h = 0; h < 24; h += 1) {
    for (let m = 0; m < 60; m += interval) {
      times.push(formatTime({ hours: h, minutes: m }));
    }
  }

  return times;
};

export const getTimeObjects = (interval: number): TimeObject[] => {
  const times: TimeObject[] = [];

  for (let h = 0; h < 24; h += 1) {
    for (let m = 0; m < 60; m += interval) {
      times.push({ hours: h, minutes: m });
    }
  }

  return times;
};

export const getTimeObject = (time: string): TimeObject => {
  const hours = Number(time.replace(':', '.').split('.')[0]);
  const minutes = Number(time.replace(':', '.').split('.')[1]);

  return {
    hours: Number.isInteger(hours) && hours < 24 && hours >= 0 ? hours : 0,
    minutes:
      Number.isInteger(minutes) && minutes < 60 && minutes >= 0 ? minutes : 0,
  };
};
