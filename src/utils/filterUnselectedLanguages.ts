import { LocalisedObject } from '../generated/graphql';

export const filterUnselectedLanguages = (
  obj: LocalisedObject,
  eventInfoLanguages: string[]
): LocalisedObject =>
  Object.entries(obj).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [k]: eventInfoLanguages.includes(k) ? v : null,
    }),
    {}
  );
