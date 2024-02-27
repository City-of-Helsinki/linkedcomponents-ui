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
import { PRICE_GROUP_ACTIONS } from '../constants';
import { getEditPriceGroupButtonProps } from '../utils';

export interface CreateButtonPanelProps {
  onSave: () => void;
  publisher: string;
  saving: PRICE_GROUP_ACTIONS | null;
}

const CreateButtonPanel: React.FC<CreateButtonPanelProps> = ({
  onSave,
  publisher,
  saving,
}) => {
  const { t } = useTranslation();

  const { authenticated } = useAuth();
  const { user } = useUser();

  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const goBack = useGoBack({ defaultReturnPath: ROUTES.KEYWORDS });

  const buttonProps = getEditPriceGroupButtonProps({
    action: PRICE_GROUP_ACTIONS.CREATE,
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
          loading={saving === PRICE_GROUP_ACTIONS.CREATE}
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
