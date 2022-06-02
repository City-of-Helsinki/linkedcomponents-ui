import { Dialog, IconAlertCircle, IconCross } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../common/components/button/Button';
import styles from '../../../../common/components/dialog/dialog.module.scss';
import LoadingButton from '../../../../common/components/loadingButton/LoadingButton';
import {
  EnrolmentFieldsFragment,
  RegistrationFieldsFragment,
} from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import { getEnrolmentFields } from '../../../enrolments/utils';

export interface ConfirmCancelModalProps {
  enrolment: EnrolmentFieldsFragment;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onCancel: () => void;
  registration: RegistrationFieldsFragment;
}

const ConfirmCancelModal: React.FC<ConfirmCancelModalProps> = ({
  enrolment,
  isOpen,
  isSaving,
  onClose,
  onCancel,
  registration,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { name } = getEnrolmentFields({
    enrolment,
    language: locale,
    registration,
  });

  const handleClose = (event?: React.MouseEvent | React.KeyboardEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    onClose();
  };

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    onCancel();
  };

  const id = 'confirm-enrolment-cancel-modal';
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <Dialog
      id={id}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={styles.dialog}
      isOpen={isOpen}
      variant="danger"
    >
      <Dialog.Header
        id={titleId}
        iconLeft={<IconAlertCircle aria-hidden={true} />}
        title={t('enrolment.cancelEnrolmentModal.title')}
      />
      <Dialog.Content>
        <p className={styles.warning}>
          <strong>{t('common.warning')}</strong>
        </p>
        <p id={descriptionId}>{t('enrolment.cancelEnrolmentModal.text1')}</p>
        <p>{t('enrolment.cancelEnrolmentModal.text2')}</p>
        <ul className={styles.list}>
          <li>
            <strong>{name}</strong>
          </li>
        </ul>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <LoadingButton
          disabled={isSaving}
          icon={<IconCross aria-hidden={true} />}
          loading={isSaving}
          onClick={handleCancel}
          type="button"
          variant="danger"
        >
          {t('enrolment.cancelEnrolmentModal.buttonCancel')}
        </LoadingButton>
        <Button
          disabled={isSaving}
          onClick={handleClose}
          theme="black"
          type="button"
          variant="secondary"
        >
          {t('common.cancel')}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

export default ConfirmCancelModal;
