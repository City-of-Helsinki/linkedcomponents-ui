import { PlaceFieldsFragment } from '../../src/generated/graphql';
import { Language } from '../../src/types';
import { removeEmpty } from './utils';

export const getExpectedPlaceContext = (
  place: Partial<PlaceFieldsFragment>,
  ...fieldsToPick: Array<keyof PlaceFieldsFragment>
): Partial<PlaceFieldsFragment> =>
  removeEmpty(
    fieldsToPick.reduce(
      (fields, field) => ({ ...fields, [field]: place[field] }),
      { id: place.id, name: place.name.fi }
    )
  );

export const isLocalized = (
  place: PlaceFieldsFragment,
  locale: Language
): boolean => Boolean(place.name?.[locale]);

export const isInternetLocation = (location: PlaceFieldsFragment): boolean =>
  location.id === 'helsinki:internet' || location.id === 'system:internet';

export const hasStreetAddress = (location: PlaceFieldsFragment): boolean =>
  !!location.streetAddress;
