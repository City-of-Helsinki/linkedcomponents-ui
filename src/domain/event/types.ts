import { EVENT_FIELDS } from './constants';

export type EventTime = {
  [EVENT_FIELDS.END_TIME]: Date | null;
  [EVENT_FIELDS.START_TIME]: Date | null;
};
