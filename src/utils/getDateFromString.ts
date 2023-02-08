import { Maybe } from '../types';

const getDateFromString = (date: Maybe<Date | string>): Date | null =>
  date ? new Date(date) : null;

export default getDateFromString;
