import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { TFunction } from 'i18next';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../constants';
import {
  Image,
  ImageDocument,
  ImageFieldsFragment,
  ImageQuery,
  ImageQueryVariables,
  ImagesQueryVariables,
  OrganizationFieldsFragment,
  UserFieldsFragment,
} from '../../generated/graphql';
import { Editability, Language, PathBuilderProps } from '../../types';
import getPathBuilder from '../../utils/getPathBuilder';
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
  altText: string;
  id: string;
  imageUrl: string;
  lastModifiedTime: Date | null;
  license: LICENSE_TYPES;
  name: string;
  photographerName: string;
  url: string;
};

export const getImageFields = (
  image: ImageFieldsFragment,
  language: Language
): ImageFields => {
  const id = image.id ?? '';
  return {
    altText: image.altText || '',
    id,
    imageUrl: `/${language}${ROUTES.EDIT_IMAGE.replace(':id', id)}`,
    lastModifiedTime: image.lastModifiedTime
      ? new Date(image.lastModifiedTime)
      : null,
    license: (image.license as LICENSE_TYPES) || DEFAULT_LICENSE_TYPE,
    name: image.name || '',
    photographerName: image.photographerName || '',
    url: image.url || '',
  };
};

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
    case IMAGE_ACTIONS.UPDATE:
      return isRegularUser || isAdminUser;
    case IMAGE_ACTIONS.UPLOAD:
      return isRegularUser || isAdminUser;
  }
};

export const getImageActionWarning = ({
  action,
  authenticated,
  publisher,
  t,
  userCanDoAction,
}: {
  action: IMAGE_ACTIONS;
  authenticated: boolean;
  publisher: string;
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
    publisher,
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

export const clearImagesQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  args?: Record<string, unknown>
): boolean =>
  apolloClient.cache.evict({ id: 'ROOT_QUERY', fieldName: 'images', args });

export const getImageItemId = (id: string): string => `image-item-${id}`;
