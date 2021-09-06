import { IconPen } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Button from '../../../common/components/button/Button';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Container from '../../app/layout/Container';
import { authenticatedSelector } from '../../auth/selectors';
import {
  getCreateRegistrationButtonWarning,
  isCreateRegistrationButtonDisabled,
} from '../utils';
import styles from './createButtonPanel.module.scss';

interface Props {
  saving: boolean;
}

const CreateButtonPanel: React.FC<Props> = ({ saving }) => {
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
    <div className={styles.buttonPanel}>
      <Container withOffset={true}>
        <div className={styles.buttonsRow}>
          <div className={styles.buttonColumn}>
            <Button
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
              title={isCreateButtonWarning()}
              type="submit"
            >
              {t('registration.form.buttonCreate')}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CreateButtonPanel;
