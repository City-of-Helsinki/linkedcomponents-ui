import { PlaceFieldsFragment } from '../../src/generated/graphql';

export const isInternetLocation = (location: PlaceFieldsFragment): boolean =>
  location.id === 'helsinki:internet';
