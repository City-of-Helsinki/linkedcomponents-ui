import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import styles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { authenticatedSelector } from '../../auth/selectors';
import { REGISTRATION_ACTIONS } from '../../registrations/constants';
import useUser from '../../user/hooks/useUser';
import { getEditButtonProps } from '../utils';

interface Props {
  onSave: () => void;
  saving: boolean;
}

const CreateButtonPanel: React.FC<Props> = ({ onSave, saving }) => {
  const { t } = useTranslation();
  const authenticated = useSelector(authenticatedSelector);
  const { user } = useUser();

  const buttonProps = getEditButtonProps({
    action: REGISTRATION_ACTIONS.CREATE,
    authenticated,
    onClick: onSave,
    organizationAncestors: [],
    publisher: '',
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
          disabled={saving || buttonProps.disabled}
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
