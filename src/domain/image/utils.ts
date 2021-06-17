import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { TFunction } from 'i18next';

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
import { PathBuilderProps } from '../../types';
import getPathBuilder from '../../utils/getPathBuilder';
import queryBuilder from '../../utils/queryBuilder';
import {
  isAdminUserInOrganization,
  isReqularUserInOrganization,
} from '../organization/utils';
import {
  DEFAULT_LICENSE_TYPE,
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
  const { dataSource, page, pageSize, publisher } = args;
  const variableToKeyItems = [
    { key: 'data_source', value: dataSource },
    { key: 'page', value: page },
    { key: 'page_size', value: pageSize },
    { key: 'publisher', value: publisher },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/image/${query}`;
};

type ImageFields = {
  altText: string;
  license: LICENSE_TYPES;
  name: string;
  photographerName: string;
};

export const getImageFields = (image: ImageFieldsFragment): ImageFields => ({
  altText: image.altText || '',
  license: (image.license as LICENSE_TYPES) || DEFAULT_LICENSE_TYPE,
  name: image.name || '',
  photographerName: image.photographerName || '',
});

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

  switch (action) {
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
  if (!publisher) {
    return t('image.warningNoImageSelected');
  }

  if (!authenticated) {
    switch (action) {
      case IMAGE_ACTIONS.UPDATE:
        return t('image.warningLogInToUpdate');
      case IMAGE_ACTIONS.UPLOAD:
        return t('image.warningLogInToUpload');
    }
  }

  if (!userCanDoAction) {
    switch (action) {
      case IMAGE_ACTIONS.UPDATE:
        return t('image.warningNoRightsToUpdate');
      case IMAGE_ACTIONS.UPLOAD:
        return t('image.warningNoRightsToUpload');
    }
  }

  return '';
};

type EventEditability = {
  editable: boolean;
  warning: string;
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
}): EventEditability => {
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
