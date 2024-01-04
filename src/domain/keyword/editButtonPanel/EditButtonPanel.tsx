import React from 'react';
import { useTranslation } from 'react-i18next';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import buttonPanelStyles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { ROUTES } from '../../../constants';
import useGoBack from '../../../hooks/useGoBack';
import useAuth from '../../auth/hooks/useAuth';
import { KeywordsLocationState } from '../../keywords/types';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { KEYWORD_ACTIONS } from '../constants';
import { getEditButtonProps } from '../utils';

export interface EditButtonPanelProps {
  id: string;
  onSave: () => void;
  publisher: string;
  saving: KEYWORD_ACTIONS | null;
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

  const goBack = useGoBack<KeywordsLocationState>({
    defaultReturnPath: ROUTES.KEYWORDS,
    state: { keywordId: id },
  });

  const buttonProps = getEditButtonProps({
    action: KEYWORD_ACTIONS.UPDATE,
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
          loading={saving === KEYWORD_ACTIONS.UPDATE}
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
