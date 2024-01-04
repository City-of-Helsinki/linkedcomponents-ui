import React from 'react';
import { useTranslation } from 'react-i18next';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import buttonPanelStyles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { ROUTES } from '../../../constants';
import useGoBack from '../../../hooks/useGoBack';
import useAuth from '../../auth/hooks/useAuth';
import { ImagesLocationState } from '../../images/types';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { IMAGE_ACTIONS } from '../constants';
import { getEditButtonProps } from '../utils';

export interface EditButtonPanelProps {
  id: string;
  onSave: () => void;
  publisher: string;
  saving: IMAGE_ACTIONS | null;
}

const EditButtonPanel: React.FC<EditButtonPanelProps> = ({
  id,
  onSave,
  publisher,
  saving,
}) => {
  const { t } = useTranslation();

  const { authenticated } = useAuth();
  const { user } = useUser();

  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const goBack = useGoBack<ImagesLocationState>({
    defaultReturnPath: ROUTES.IMAGES,
    state: { imageId: id },
  });

  const buttonProps = getEditButtonProps({
    action: IMAGE_ACTIONS.UPDATE,
    authenticated,
    onClick: onSave,
    organizationAncestors,
    publisher,
    t,
    user,
  });

  return (
    <ButtonPanel
      onBack={goBack}
      submitButtons={[
        <LoadingButton
          key="save"
          {...buttonProps}
          className={buttonPanelStyles.fullWidthOnMobile}
          disabled={buttonProps.disabled}
          loading={saving === IMAGE_ACTIONS.UPDATE}
          type="submit"
        >
          {buttonProps.label}
        </LoadingButton>,
      ]}
      withOffset={false}
    />
  );
};

export default EditButtonPanel;
