import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useImageQuery } from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import { useAuth } from '../../auth/hooks/useAuth';
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
  const { isAuthenticated: authenticated } = useAuth();
  const { t } = useTranslation();
  const { user } = useUser();
  const { data: imageData } = useImageQuery({
    skip: !imageAtId,
    variables: {
      createPath: getPathBuilder(imagePathBuilder),
      id: getValue(parseIdFromAtId(imageAtId), ''),
    },
  });

  const { organizationAncestors } = useOrganizationAncestors(
    getValue(imageData?.image.publisher, '')
  );

  const { editable, warning } = useMemo(() => {
    return checkIsImageActionAllowed({
      action: IMAGE_ACTIONS.UPDATE,
      authenticated,
      organizationAncestors,
      publisher: getValue(imageData?.image.publisher, ''),
      t,
      user,
    });
  }, [authenticated, imageData, organizationAncestors, t, user]);

  return { editable, warning };
};

export default useIsImageEditable;
