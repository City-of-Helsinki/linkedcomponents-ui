import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { TFunction } from 'i18next';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/types';
import { ROUTES } from '../../constants';
import {
  Image,
  ImageDocument,
  ImageFieldsFragment,
  ImageQuery,
  ImageQueryVariables,
  ImagesQueryVariables,
  LocalisedFieldsFragment,
  OrganizationFieldsFragment,
  UpdateImageMutationInput,
  UserFieldsFragment,
} from '../../generated/graphql';
import {
  Editability,
  Language,
  Maybe,
  MultiLanguageObject,
  PathBuilderProps,
} from '../../types';
import getDateFromString from '../../utils/getDateFromString';
import getLocalisedObject from '../../utils/getLocalisedObject';
import getPathBuilder from '../../utils/getPathBuilder';
import getValue from '../../utils/getValue';
import queryBuilder from '../../utils/queryBuilder';
import {
  isAdminUserInOrganization,
  isReqularUserInOrganization,
} from '../organization/utils';
import {
  AUTHENTICATION_NOT_NEEDED,
  DEFAULT_LICENSE_TYPE,
  IMAGE_ACTION_ICONS,
  IMAGE_ACTION_LABEL_KEYS,
  IMAGE_ACTIONS,
  LICENSE_TYPES,
} from './constants';
import { ImageFormFields } from './types';

export const imagePathBuilder = ({
  args,
}: PathBuilderProps<ImageQueryVariables>): string => {
  const { id } = args;

  return `/image/${id}/`;
};

export const imagesPathBuilder = ({
  args,
}: PathBuilderProps<ImagesQueryVariables>): string => {
  const { dataSource, page, pageSize, publisher, sort, text } = args;
  const variableToKeyItems = [
    { key: 'data_source', value: dataSource },
    { key: 'page', value: page },
    { key: 'page_size', value: pageSize },
    { key: 'publisher', value: publisher },
    { key: 'sort', value: sort },
    { key: 'text', value: text },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/image/${query}`;
};

type ImageFields = {
  altText: MultiLanguageObject;
  id: string;
  imageUrl: string;
  lastModifiedTime: Date | null;
  license: LICENSE_TYPES;
  name: string;
  photographerName: string;
  publisher: string;
  url: string;
};

export const getImageFields = (
  image: ImageFieldsFragment,
  language: Language
): ImageFields => {
  const id = getValue(image.id, '');

  return {
    altText: getImageAltText(image.altText),
    id,
    imageUrl: `/${language}${ROUTES.EDIT_IMAGE.replace(':id', id)}`,
    lastModifiedTime: getDateFromString(image.lastModifiedTime),
    license: getValue(image.license, DEFAULT_LICENSE_TYPE) as LICENSE_TYPES,
    name: getValue(image.name, ''),
    photographerName: getValue(image.photographerName, ''),
    publisher: getValue(image.publisher, ''),
    url: getValue(image.url, ''),
  };
};

export const getImageAltText = (
  altText: Maybe<LocalisedFieldsFragment> | string
) =>
  getLocalisedObject(typeof altText === 'string' ? { fi: altText } : altText);

export const checkCanUserDoAction = ({
  action,
  organizationAncestors,
  publisher,
  user,
}: {
  action: IMAGE_ACTIONS;
  organizationAncestors: OrganizationFieldsFragment[];
  publisher: string;
  user?: UserFieldsFragment;
}): boolean => {
  const isRegularUser = isReqularUserInOrganization({ id: publisher, user });
  const isAdminUser = isAdminUserInOrganization({
    id: publisher,
    organizationAncestors,
    user,
  });
  const hasOrganizations =
    !!user?.adminOrganizations.length || !!user?.organizationMemberships.length;

  switch (action) {
    case IMAGE_ACTIONS.EDIT:
      return true;
    case IMAGE_ACTIONS.CREATE:
      return hasOrganizations;
    case IMAGE_ACTIONS.DELETE:
      return isAdminUser;
    case IMAGE_ACTIONS.UPDATE:
    case IMAGE_ACTIONS.UPLOAD:
      return isRegularUser || isAdminUser;
  }
};

export const getImageActionWarning = ({
  action,
  authenticated,
  t,
  userCanDoAction,
}: {
  action: IMAGE_ACTIONS;
  authenticated: boolean;
  t: TFunction;
  userCanDoAction: boolean;
}): string => {
  if (AUTHENTICATION_NOT_NEEDED.includes(action)) {
    return '';
  }

  if (!authenticated) {
    switch (action) {
      case IMAGE_ACTIONS.UPDATE:
        return t('image.warningLogInToUpdate');
      case IMAGE_ACTIONS.CREATE:
      case IMAGE_ACTIONS.UPLOAD:
        return t('image.warningLogInToUpload');
      default:
        return t('authentication.noRightsUpdateImage');
    }
  }

  if (!userCanDoAction) {
    switch (action) {
      case IMAGE_ACTIONS.UPDATE:
        return t('image.warningNoRightsToUpdate');
      case IMAGE_ACTIONS.CREATE:
      case IMAGE_ACTIONS.UPLOAD:
        return t('image.warningNoRightsToUpload');
      default:
        return t('image.warningNoRightsToEdit');
    }
  }

  return '';
};

export const checkIsImageActionAllowed = ({
  action,
  authenticated,
  organizationAncestors,
  publisher,
  t,
  user,
}: {
  action: IMAGE_ACTIONS;
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

  const warning = getImageActionWarning({
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
  action: IMAGE_ACTIONS;
  authenticated: boolean;
  onClick: () => void;
  organizationAncestors: OrganizationFieldsFragment[];
  publisher: string;
  t: TFunction;
  user?: UserFieldsFragment;
}): MenuItemOptionProps => {
  const { editable, warning } = checkIsImageActionAllowed({
    action,
    authenticated,
    organizationAncestors,
    publisher,
    t,
    user,
  });

  return {
    disabled: !editable,
    icon: IMAGE_ACTION_ICONS[action],
    label: t(IMAGE_ACTION_LABEL_KEYS[action]),
    onClick,
    title: warning,
  };
};

export const getImageInitialValues = (
  image: ImageFieldsFragment
): ImageFormFields => {
  return {
    altText: getLocalisedObject(image.altText),
    id: getValue(image.id, ''),
    license: getValue(image.license, ''),
    name: getValue(image.name, ''),
    photographerName: getValue(image.photographerName, ''),
    publisher: getValue(image.publisher, ''),
    url: getValue(image.url, ''),
  };
};

export const getImagePayload = (
  formValues: ImageFormFields
): UpdateImageMutationInput => {
  return { ...omit(formValues, 'url') };
};

export const getImageQueryResult = async (
  id: string,
  apolloClient: ApolloClient<NormalizedCacheObject>
): Promise<Image | null> => {
  try {
    const { data: imageData } = await apolloClient.query<ImageQuery>({
      query: ImageDocument,
      variables: {
        id,
        createPath: getPathBuilder(imagePathBuilder),
      },
    });

    return imageData.image;
  } catch (e) /* istanbul ignore next */ {
    return null;
  }
};

export const getImageItemId = (id: string): string => `image-item-${id}`;

export const isImageUpdateNeeded = (
  image: ImageFieldsFragment,
  values: ImageFormFields
) => {
  const initialValues = getImageInitialValues(image);

  return (
    !isEqual(initialValues.altText, values.altText) ||
    initialValues.license !== values.license ||
    initialValues.name !== values.name ||
    initialValues.photographerName !== values.photographerName
  );
};
