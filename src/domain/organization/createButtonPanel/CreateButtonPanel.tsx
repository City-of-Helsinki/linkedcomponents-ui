import React from 'react';
import { useTranslation } from 'react-i18next';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import buttonPanelStyles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { ROUTES } from '../../../constants';
import useGoBack from '../../../hooks/useGoBack';
import { useAuth } from '../../auth/hooks/useAuth';
import useUser from '../../user/hooks/useUser';
import { ORGANIZATION_ACTIONS } from '../constants';
import { getEditButtonProps } from '../utils';

export interface CreateButtonPanelProps {
  onSave: () => void;
  saving: ORGANIZATION_ACTIONS | null;
}

const CreateButtonPanel: React.FC<CreateButtonPanelProps> = ({
  onSave,
  saving,
}) => {
  const { t } = useTranslation();

  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();

  const goBack = useGoBack({ defaultReturnPath: ROUTES.KEYWORD_SETS });

  const buttonProps = getEditButtonProps({
    action: ORGANIZATION_ACTIONS.CREATE,
    authenticated,
    id: '',
    onClick: onSave,
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
          loading={saving === ORGANIZATION_ACTIONS.CREATE}
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
