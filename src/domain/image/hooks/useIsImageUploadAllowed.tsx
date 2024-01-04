import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import useAuth from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { IMAGE_ACTIONS } from '../constants';
import { checkIsImageActionAllowed } from '../utils';

interface Props {
  publisher: string;
}

type IsImageUploadAllowedState = {
  allowed: boolean;
  warning: string;
};

const useIsImageUploadAllowed = ({
  publisher,
}: Props): IsImageUploadAllowedState => {
  const { authenticated } = useAuth();
  const { t } = useTranslation();
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { allowed, warning } = useMemo(() => {
    const { editable: allowed, warning } = checkIsImageActionAllowed({
      action: IMAGE_ACTIONS.UPLOAD,
      authenticated,
      organizationAncestors,
      publisher,
      t,
      user,
    });
    return { allowed, warning };
  }, [authenticated, organizationAncestors, publisher, t, user]);

  return { allowed, warning };
};

export default useIsImageUploadAllowed;
