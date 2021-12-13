import { IconPen } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import buttonPanelStyles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { ROUTES } from '../../../constants';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useGoBack from '../../../hooks/useGoBack';
import styles from './createButtonPanel.module.scss';

export interface CreateButtonPanelProps {
  disabled: boolean;
  onSave: () => void;
  registration: RegistrationFieldsFragment;
  saving: boolean;
}

const CreateButtonPanel: React.FC<CreateButtonPanelProps> = ({
  disabled,
  onSave,
  registration,
  saving,
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
        <LoadingButton
          key="save"
          className={buttonPanelStyles.fullWidthOnMobile}
          disabled={disabled}
          fullWidth={true}
          icon={<IconPen aria-hidden={true} />}
          loading={saving}
          onClick={onSave}
          type="submit"
        >
          {t('enrolment.form.buttonSave')}
        </LoadingButton>,
      ]}
    />
  );
};

export default CreateButtonPanel;
