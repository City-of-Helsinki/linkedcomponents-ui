import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { TFunction } from 'i18next';
import { LatLng } from 'leaflet';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/types';
import { LINKED_EVENTS_SYSTEM_DATA_SOURCE, ROUTES } from '../../constants';
import {
  CreatePlaceMutationInput,
  OrganizationFieldsFragment,
  PlaceDocument,
  PlaceFieldsFragment,
  PlaceQuery,
  PlaceQueryVariables,
  PlacesQueryVariables,
  UserFieldsFragment,
} from '../../generated/graphql';
import { Editability, Language, PathBuilderProps } from '../../types';
import getLocalisedObject from '../../utils/getLocalisedObject';
import getLocalisedString from '../../utils/getLocalisedString';
import getPathBuilder from '../../utils/getPathBuilder';
import getValue from '../../utils/getValue';
import queryBuilder from '../../utils/queryBuilder';
import { isAdminUserInOrganization } from '../organization/utils';
import {
  AUTHENTICATION_NOT_NEEDED,
  PLACE_ACTION_ICONS,
  PLACE_ACTION_LABEL_KEYS,
  PLACE_ACTIONS,
  PLACE_FORM_SELECT_FIELDS,
} from './constants';
import { PlaceFields, PlaceFormFields } from './types';

export const getPlaceItemId = (id: string): string => `place-item-${id}`;

export const getPlaceFields = (
  place: PlaceFieldsFragment,
  locale: Language
): PlaceFields => {
  const id = getValue(place.id, '');

  return {
    addressLocality: getLocalisedString(place.addressLocality, locale),
    atId: getValue(place.atId, ''),
    dataSource: getValue(place.dataSource, ''),
    id,
    name: getLocalisedString(place.name, locale),
    nEvents: place.nEvents ?? 0,
    placeUrl: `/${locale}${ROUTES.EDIT_PLACE.replace(':id', id)}`,
    publisher: getValue(place.publisher, ''),
    streetAddress: getLocalisedString(place.streetAddress, locale),
  };
};

export const getPlaceInitialValues = (
  place: PlaceFieldsFragment
): PlaceFormFields => {
  const id = getValue(place.id, '');

  return {
    addressLocality: getLocalisedObject(place.addressLocality),
    addressRegion: getValue(place.addressRegion, ''),
    coordinates: place.position?.coordinates
      ? new LatLng(
          place.position?.coordinates[1] as number,
          place.position?.coordinates[0] as number
        )
      : null,
    contactType: getValue(place.contactType, ''),
    dataSource: getValue(place.dataSource, ''),
    description: getLocalisedObject(place.description),
    email: getValue(place.email, ''),
    id,
    infoUrl: getLocalisedObject(place.infoUrl),
    name: getLocalisedObject(place.name),
    originId: getValue(id.split(':')[1], ''),
    postOfficeBoxNum: getValue(place.postOfficeBoxNum, ''),
    postalCode: getValue(place.postalCode, ''),
    publisher: getValue(place.publisher, ''),
    streetAddress: getLocalisedObject(place.streetAddress),
    telephone: getLocalisedObject(place.telephone),
  };
};

export const getPlacePayload = (
  formValues: PlaceFormFields
): CreatePlaceMutationInput => {
  const { coordinates, originId, id, ...restFormValues } = formValues;
  const dataSource = formValues.dataSource || LINKED_EVENTS_SYSTEM_DATA_SOURCE;

  return {
    ...restFormValues,
    dataSource,
    id: id || (originId ? `${dataSource}:${originId}` : undefined),
    originId,
    position: coordinates
      ? { type: 'Point', coordinates: [coordinates?.lng, coordinates?.lat] }
      : null,
  };
};

export const placePathBuilder = ({
  args,
}: PathBuilderProps<PlaceQueryVariables>): string => {
  const { id } = args;

  return `/place/${id}/`;
};

export const placesPathBuilder = ({
  args,
}: PathBuilderProps<PlacesQueryVariables>): string => {
  const {
    dataSource,
    division,
    hasUpcomingEvents,
    page,
    pageSize,
    showAllPlaces,
    sort,
    text,
  } = args;

  const variableToKeyItems = [
    { key: 'data_source', value: dataSource },
    { key: 'division', value: division },
    { key: 'has_upcoming_events', value: hasUpcomingEvents },
    { key: 'page', value: page },
    { key: 'page_size', value: pageSize },
    { key: 'show_all_places', value: showAllPlaces },
    { key: 'sort', value: sort },
    { key: 'text', value: text },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/place/${query}`;
};

export const getPlaceFromCache = (
  id: string,
  apolloClient: ApolloClient<NormalizedCacheObject>
): PlaceFieldsFragment | null => {
  const data = apolloClient.readQuery<PlaceQuery>({
    query: PlaceDocument,
    variables: {
      id,
      createPath: getPathBuilder(placePathBuilder),
    },
  });

  return getValue(data?.place, null);
};

export const getPlaceQueryResult = async (
  id: string,
  apolloClient: ApolloClient<NormalizedCacheObject>
): Promise<PlaceFieldsFragment | null> => {
  try {
    const { data: placeData } = await apolloClient.query<PlaceQuery>({
      query: PlaceDocument,
      variables: {
        id,
        createPath: getPathBuilder(placePathBuilder),
      },
    });

    return placeData.place;
  } catch (e) /* istanbul ignore next */ {
    return null;
  }
};

export const checkCanUserDoAction = ({
  action,
  organizationAncestors,
  publisher,
  user,
}: {
  action: PLACE_ACTIONS;
  organizationAncestors: OrganizationFieldsFragment[];
  publisher: string;
  user?: UserFieldsFragment;
}): boolean => {
  /* istanbul ignore next */
  const adminOrganizations = getValue(user?.adminOrganizations, []);
  const isAdminUser = isAdminUserInOrganization({
    id: publisher,
    organizationAncestors,
    user,
  });

  switch (action) {
    case PLACE_ACTIONS.EDIT:
      return true;
    case PLACE_ACTIONS.CREATE:
      return publisher ? isAdminUser : !!adminOrganizations.length;
    case PLACE_ACTIONS.DELETE:
    case PLACE_ACTIONS.UPDATE:
      return isAdminUser;
  }
};

export const getEditPlaceWarning = ({
  action,
  authenticated,
  t,
  userCanDoAction,
}: {
  action: PLACE_ACTIONS;
  authenticated: boolean;
  t: TFunction;
  userCanDoAction: boolean;
}): string => {
  if (AUTHENTICATION_NOT_NEEDED.includes(action)) {
    return '';
  }

  if (!authenticated) {
    return t('authentication.noRightsUpdatePlace');
  }

  if (!userCanDoAction) {
    if (action === PLACE_ACTIONS.CREATE) {
      return t('placesPage.warningNoRightsToCreate');
    } else {
      return t('placesPage.warningNoRightsToEdit');
    }
  }

  return '';
};

export const checkIsEditActionAllowed = ({
  action,
  authenticated,
  organizationAncestors,
  publisher,
  t,
  user,
}: {
  action: PLACE_ACTIONS;
  authenticated: boolean;
  organizationAncestors: OrganizationFieldsFragment[];
  publisher: string;
  t: TFunction;
  user?: UserFieldsFragment;
}): Editability => {
  const userCanDoAction = checkCanUserDoAction({
    action,
    organizationAncestors,
    publisher,
    user,
  });

  const warning = getEditPlaceWarning({
    action,
    authenticated,
    t,
    userCanDoAction,
  });

  return { editable: !warning, warning };
};

export const getEditButtonProps = ({
  action,
  authenticated,
  onClick,
  organizationAncestors,
  publisher,
  t,
  user,
}: {
  action: PLACE_ACTIONS;
  authenticated: boolean;
  onClick: () => void;
  organizationAncestors: OrganizationFieldsFragment[];
  publisher: string;
  t: TFunction;
  user?: UserFieldsFragment;
}): MenuItemOptionProps => {
  const { editable, warning } = checkIsEditActionAllowed({
    action,
    authenticated,
    organizationAncestors,
    publisher,
    t,
    user,
  });

  return {
    disabled: !editable,
    icon: PLACE_ACTION_ICONS[action],
    label: t(PLACE_ACTION_LABEL_KEYS[action]),
    onClick,
    title: warning,
  };
};

export const getFocusableFieldId = (fieldName: string): string => {
  // For the select elements, focus the toggle button
  if (PLACE_FORM_SELECT_FIELDS.find((item) => item === fieldName)) {
    return `${fieldName}-toggle-button`;
  }

  return fieldName;
};
