import { useApolloClient } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { useUpdateImageMutation } from '../../../generated/graphql';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import { authenticatedSelector } from '../../auth/selectors';
import { IMAGE_ACTIONS } from '../../image/constants';
import {
  checkIsImageActionAllowed,
  getImageQueryResult,
} from '../../image/utils';
import { getOrganizationAncestorsQueryResult } from '../../organization/utils';
import useUser from '../../user/hooks/useUser';
import { EventFormFields } from '../types';

type UpdateImageIfNeededState = {
  updateImageIfNeeded: (values: EventFormFields) => void;
};

const useUpdateImageIfNeeded = (): UpdateImageIfNeededState => {
  const apolloClient = useApolloClient();
  const { t } = useTranslation();
  const authenticated = useSelector(authenticatedSelector);
  const { user } = useUser();
  const [updateImage] = useUpdateImageMutation();

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

      const needsToUpdate =
        image?.altText !== imageDetails.altText ||
        image?.license !== imageDetails.license ||
        image?.name !== imageDetails.name ||
        image?.photographerName !== imageDetails.photographerName;

      if (editable && needsToUpdate) {
        await updateImage({
          variables: {
            input: {
              id: parseIdFromAtId(imageId) as string,
              ...imageDetails,
            },
          },
        });
      }
    }
  };
  return { updateImageIfNeeded };
};

export default useUpdateImageIfNeeded;
