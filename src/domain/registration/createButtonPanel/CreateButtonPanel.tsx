import { IconPen } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import styles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
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
        <LoadingButton
          key="create"
          className={styles.fullWidthOnMobile}
          disabled={saving || isCreateButtonDisabled()}
          icon={<IconPen aria-hidden={true} />}
          loading={saving}
          onClick={onSave}
          title={isCreateButtonWarning()}
          type="submit"
        >
          {t('registration.form.buttonCreate')}
        </LoadingButton>,
      ]}
    />
  );
};

export default CreateButtonPanel;
