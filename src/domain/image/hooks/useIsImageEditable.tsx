import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { useImageQuery } from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import { authenticatedSelector } from '../../auth/selectors';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { IMAGE_ACTIONS } from '../constants';
import { checkIsImageActionAllowed, imagePathBuilder } from '../utils';

interface Props {
  imageAtId: string;
}

type IsImageEditableState = {
  editable: boolean;
  warning: string;
};

const useIsImageEditable = ({ imageAtId }: Props): IsImageEditableState => {
  const authenticated = useSelector(authenticatedSelector);
  const { t } = useTranslation();
  const { user } = useUser();
  const { data: imageData } = useImageQuery({
    skip: !imageAtId,
    variables: {
      createPath: getPathBuilder(imagePathBuilder),
      id: parseIdFromAtId(imageAtId) as string,
    },
  });

  const { organizationAncestors } = useOrganizationAncestors(
    imageData?.image.publisher as string
  );

  const { editable, warning } = useMemo(() => {
    return checkIsImageActionAllowed({
      action: IMAGE_ACTIONS.UPDATE,
      authenticated,
      organizationAncestors,
      publisher: imageData?.image.publisher ?? '',
      t,
      user,
    });
  }, [authenticated, imageData, organizationAncestors, t, user]);

  return { editable, warning };
};

export default useIsImageEditable;
