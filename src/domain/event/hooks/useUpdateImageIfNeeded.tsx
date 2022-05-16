import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { useUpdateImageMutation } from '../../../generated/graphql';
import isTestEnv from '../../../utils/isTestEnv';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import { authenticatedSelector } from '../../auth/selectors';
import { IMAGE_ACTIONS } from '../../image/constants';
import { ImageFormFields } from '../../image/types';
import {
  checkIsImageActionAllowed,
  clearImageQueries,
  clearImagesQueries,
  getImageQueryResult,
  isImageUpdateNeeded,
} from '../../image/utils';
import { getOrganizationAncestorsQueryResult } from '../../organization/utils';
import useUser from '../../user/hooks/useUser';
import { EventFormFields } from '../types';

type UpdateImageIfNeededState = {
  updateImageIfNeeded: (values: EventFormFields) => void;
};

const useUpdateImageIfNeeded = (): UpdateImageIfNeededState => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { t } = useTranslation();
  const authenticated = useSelector(authenticatedSelector);
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
      const imageId = parseIdFromAtId(imageAtId) as string;
      const image = await getImageQueryResult(imageId, apolloClient);
      const publisher = image?.publisher ?? '';
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
              id: parseIdFromAtId(imageId) as string,
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
