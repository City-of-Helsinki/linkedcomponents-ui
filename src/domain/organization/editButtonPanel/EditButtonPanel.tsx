import React from 'react';
import { useTranslation } from 'react-i18next';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import buttonPanelStyles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { ROUTES } from '../../../constants';
import useGoBack from '../../../hooks/useGoBack';
import useAuth from '../../auth/hooks/useAuth';
import { OrganizationsLocationState } from '../../organizations/types';
import useUser from '../../user/hooks/useUser';
import { ORGANIZATION_ACTIONS } from '../constants';
import useOrganizationAncestors from '../hooks/useOrganizationAncestors';
import { getEditOrganizationButtonProps } from '../utils';

export interface EditButtonPanelProps {
  id: string;
  onSave: () => void;
  saving: ORGANIZATION_ACTIONS | null;
}

const EditButtonPanel: React.FC<EditButtonPanelProps> = ({
  id,
  onSave,
  saving,
}) => {
  const { t } = useTranslation();

  const { authenticated } = useAuth();
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(id);

  const goBack = useGoBack<OrganizationsLocationState>({
    defaultReturnPath: ROUTES.ORGANIZATIONS,
    state: { organizationId: id },
  });

  const buttonProps = getEditOrganizationButtonProps({
    action: ORGANIZATION_ACTIONS.UPDATE,
    authenticated,
    id,
    onClick: onSave,
    organizationAncestors,
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
          loading={saving === ORGANIZATION_ACTIONS.UPDATE}
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
