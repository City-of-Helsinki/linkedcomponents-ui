import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import buttonPanelStyles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import { ROUTES } from '../../../constants';
import { Registration } from '../../../generated/graphql';
import useGoBack from '../../../hooks/useGoBack';
import styles from './createButtonPanel.module.scss';

export interface CreateButtonPanelProps {
  onSave: () => void;
  registration: Registration;
}

const CreateButtonPanel: React.FC<CreateButtonPanelProps> = ({
  onSave,
  registration,
}) => {
  const { t } = useTranslation();

  const goBack = useGoBack({
    defaultReturnPath: ROUTES.REGISTRATION_ENROLMENTS.replace(
      ':registrationId',
      registration.id as string
    ),
  });

  return (
    <ButtonPanel
      contentWrapperClassName={styles.container}
      onBack={goBack}
      submitButtons={[
        <Button
          key="save"
          className={buttonPanelStyles.fullWidthOnMobile}
          fullWidth={true}
          onClick={onSave}
          type="button"
        >
          {t('enrolment.form.buttonSave')}
        </Button>,
      ]}
    />
  );
};

export default CreateButtonPanel;
