import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import buttonPanelStyles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { ROUTES } from '../../../constants';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useGoBack from '../../../hooks/useGoBack';
import { authenticatedSelector } from '../../auth/selectors';
import useUser from '../../user/hooks/useUser';
import { KEYWORD_ACTIONS } from '../constants';
import { getEditButtonProps } from '../utils';

export interface CreateButtonPanelProps {
  onSave: () => void;
  saving: boolean;
}

const CreateButtonPanel: React.FC<CreateButtonPanelProps> = ({
  onSave,
  saving,
}) => {
  const { t } = useTranslation();

  const authenticated = useSelector(authenticatedSelector);
  const { user } = useUser();

  const goBack = useGoBack({ defaultReturnPath: ROUTES.KEYWORDS });

  const buttonProps = getEditButtonProps({
    action: KEYWORD_ACTIONS.CREATE,
    authenticated,
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
          fullWidth={true}
          loading={saving}
          type="submit"
        >
          {buttonProps.label}
        </LoadingButton>,
      ]}
    />
  );
};

export default CreateButtonPanel;
