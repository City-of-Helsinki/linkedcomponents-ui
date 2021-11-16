import { PlaceFieldsFragment } from '../../src/generated/graphql';

export const isInternetLocation = (location: PlaceFieldsFragment): boolean =>
  location.id === 'helsinki:internet' || location.id === 'system:internet';

export const hasStreetAddress = (location: PlaceFieldsFragment): boolean =>
  !!location.streetAddress;
