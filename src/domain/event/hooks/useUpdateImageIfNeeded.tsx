import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { useTranslation } from 'react-i18next';

import { useUpdateImageMutation } from '../../../generated/graphql';
import getValue from '../../../utils/getValue';
import isTestEnv from '../../../utils/isTestEnv';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import {
  clearImageQueries,
  clearImagesQueries,
} from '../../app/apollo/clearCacheUtils';
import { useAuth } from '../../auth/hooks/useAuth';
import { IMAGE_ACTIONS } from '../../image/constants';
import { ImageFormFields } from '../../image/types';
import {
  checkIsImageActionAllowed,
  getImageQueryResult,
  isImageUpdateNeeded,
} from '../../image/utils';
import { getOrganizationAncestorsQueryResult } from '../../organization/utils';
import useUser from '../../user/hooks/useUser';
import { EventFormFields } from '../types';

type UpdateImageIfNeededState = {
  updateImageIfNeeded: (values: EventFormFields) => Promise<void>;
};

const useUpdateImageIfNeeded = (): UpdateImageIfNeededState => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { t } = useTranslation();
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const [updateImage] = useUpdateImageMutation();

  const cleanAfterUpdate = async () => {
    /* istanbul ignore next */
    !isTestEnv && clearImageQueries(apolloClient);
    /* istanbul ignore next */
    !isTestEnv && clearImagesQueries(apolloClient);
  };

  const updateImageIfNeeded = async (values: EventFormFields) => {
    const { imageDetails, images } = values;

    const imageAtId = images[0];

    if (imageAtId) {
      const imageId = getValue(parseIdFromAtId(imageAtId), '');
      const image = await getImageQueryResult(imageId, apolloClient);
      const publisher = getValue(image?.publisher, '');
      const organizationAncestors = await getOrganizationAncestorsQueryResult(
        publisher,
        apolloClient
      );
      const { editable } = checkIsImageActionAllowed({
        action: IMAGE_ACTIONS.UPDATE,
        authenticated,
        organizationAncestors,
        publisher,
        t,
        user,
      });

      if (
        editable &&
        image &&
        isImageUpdateNeeded(image, imageDetails as ImageFormFields)
      ) {
        await updateImage({
          variables: {
            input: {
              id: getValue(parseIdFromAtId(imageId), ''),
              ...imageDetails,
            },
          },
        });

        cleanAfterUpdate();
      }
    }
  };

  return { updateImageIfNeeded };
};

export default useUpdateImageIfNeeded;
