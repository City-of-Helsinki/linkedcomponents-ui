import {
  EventFieldsFragment,
  PlaceFieldsFragment,
} from '../../src/generated/graphql';
import { Language } from '../../src/types';

const removeEmpty = (obj) => {
  Object.keys(obj).forEach(
    (k) =>
      (obj[k] && typeof obj[k] === 'object' && removeEmpty(obj[k])) ||
      (!obj[k] && obj[k] !== undefined && delete obj[k])
  );
  return obj;
};

export const getExpectedEventContext = (
  event: Partial<EventFieldsFragment>,
  ...fieldsToPick: Array<keyof EventFieldsFragment>
): Partial<EventFieldsFragment> =>
  removeEmpty(
    fieldsToPick.reduce(
      (fields, field) => ({ ...fields, [field]: event[field] }),
      {
        id: event.id,
        name: event.name.fi,
      }
    )
  );

export const isLocalized = (
  event: EventFieldsFragment,
  locale: Language
): boolean =>
  Boolean(
    event.name?.[locale] &&
      event.shortDescription?.[locale] &&
      event.description?.[locale]
  );
