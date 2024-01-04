import React from 'react';
import { useTranslation } from 'react-i18next';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import buttonPanelStyles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { ROUTES } from '../../../constants';
import useGoBack from '../../../hooks/useGoBack';
import useAuth from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { KEYWORD_SET_ACTIONS } from '../constants';
import { getEditButtonProps } from '../utils';

export interface CreateButtonPanelProps {
  onSave: () => void;
  organization: string;
  saving: KEYWORD_SET_ACTIONS | null;
}

const CreateButtonPanel: React.FC<CreateButtonPanelProps> = ({
  organization,
  onSave,
  saving,
}) => {
  const { t } = useTranslation();

  const { authenticated } = useAuth();
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(organization);

  const goBack = useGoBack({ defaultReturnPath: ROUTES.KEYWORD_SETS });

  const buttonProps = getEditButtonProps({
    action: KEYWORD_SET_ACTIONS.CREATE,
    authenticated,
    onClick: onSave,
    organizationAncestors,
    organization,
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
          loading={saving === KEYWORD_SET_ACTIONS.CREATE}
          type="submit"
        >
          {buttonProps.label}
        </LoadingButton>,
      ]}
      withOffset={false}
    />
  );
};

export default CreateButtonPanel;
