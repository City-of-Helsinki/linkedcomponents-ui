import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import buttonPanelStyles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { ROUTES } from '../../../constants';
import useGoBack from '../../../hooks/useGoBack';
import { authenticatedSelector } from '../../auth/selectors';
import useUser from '../../user/hooks/useUser';
import useUserOrganization from '../../user/hooks/useUserOrganization';
import { KEYWORD_SET_ACTIONS } from '../constants';
import { getEditButtonProps } from '../utils';

export interface CreateButtonPanelProps {
  dataSource: string;
  onSave: () => void;
  saving: KEYWORD_SET_ACTIONS | null;
}

const CreateButtonPanel: React.FC<CreateButtonPanelProps> = ({
  dataSource,
  onSave,
  saving,
}) => {
  const { t } = useTranslation();

  const authenticated = useSelector(authenticatedSelector);
  const { user } = useUser();
  const { organization: userOrganization } = useUserOrganization(user);

  const goBack = useGoBack({ defaultReturnPath: ROUTES.KEYWORD_SETS });

  const buttonProps = getEditButtonProps({
    action: KEYWORD_SET_ACTIONS.CREATE,
    authenticated,
    dataSource,
    onClick: onSave,
    t,
    userOrganization,
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
