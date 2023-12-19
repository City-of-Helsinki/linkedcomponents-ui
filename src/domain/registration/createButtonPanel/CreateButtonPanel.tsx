import React from 'react';
import { useTranslation } from 'react-i18next';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import styles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import useAuth from '../../auth/hooks/useAuth';
import { REGISTRATION_ACTIONS } from '../../registrations/constants';
import useUser from '../../user/hooks/useUser';
import { getRegistrationActionButtonProps } from '../permissions';

interface Props {
  onSave: () => void;
  saving: REGISTRATION_ACTIONS | null;
}

const CreateButtonPanel: React.FC<Props> = ({ onSave, saving }) => {
  const { t } = useTranslation();
  const { authenticated } = useAuth();
  const { user } = useUser();

  const buttonProps = getRegistrationActionButtonProps({
    action: REGISTRATION_ACTIONS.CREATE,
    authenticated,
    onClick: onSave,
    organizationAncestors: [],
    t,
    user,
  });

  return (
    <ButtonPanel
      submitButtons={[
        <LoadingButton
          {...buttonProps}
          key="create"
          className={styles.fullWidthOnMobile}
          disabled={
            saving === REGISTRATION_ACTIONS.CREATE || buttonProps.disabled
          }
          loading={saving === REGISTRATION_ACTIONS.CREATE}
          type="submit"
        >
          {buttonProps.label}
        </LoadingButton>,
      ]}
    />
  );
};

export default CreateButtonPanel;
