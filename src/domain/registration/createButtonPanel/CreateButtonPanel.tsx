import { IconPen } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Button from '../../../common/components/button/Button';
import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import styles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import { authenticatedSelector } from '../../auth/selectors';
import {
  getCreateRegistrationButtonWarning,
  isCreateRegistrationButtonDisabled,
} from '../utils';

interface Props {
  onSave: () => void;
  saving: boolean;
}

const CreateButtonPanel: React.FC<Props> = ({ onSave, saving }) => {
  const { t } = useTranslation();
  const authenticated = useSelector(authenticatedSelector);

  const isCreateButtonDisabled = () =>
    isCreateRegistrationButtonDisabled({
      authenticated,
    });

  const isCreateButtonWarning = () =>
    getCreateRegistrationButtonWarning({
      authenticated,
      t,
    });

  return (
    <ButtonPanel
      submitButtons={[
        <Button
          key="create"
          className={styles.fullWidthOnMobile}
          disabled={saving || isCreateButtonDisabled()}
          fullWidth={true}
          iconLeft={
            saving ? (
              <LoadingSpinner
                className={styles.loadingSpinner}
                isLoading={true}
                small={true}
              />
            ) : (
              <IconPen />
            )
          }
          onClick={onSave}
          title={isCreateButtonWarning()}
          type="submit"
        >
          {t('registration.form.buttonCreate')}
        </Button>,
      ]}
    />
  );
};

export default CreateButtonPanel;
