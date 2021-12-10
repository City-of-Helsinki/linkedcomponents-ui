import { IconCross } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Modal from '../../../common/components/modal/Modal';
import {
  EnrolmentFieldsFragment,
  RegistrationFieldsFragment,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { getEnrolmentFields } from '../../enrolments/utils';
import styles from './modals.module.scss';

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      shouldCloseOnEsc={true}
      size="m"
      title={t('enrolment.cancelEnrolmentModal.title')}
      type="alert"
    >
      <p className={styles.warning}>
        <strong>{t('common.warning')}</strong>
      </p>
      <p>{t('enrolment.cancelEnrolmentModal.text1')} </p>
      <p>{t('enrolment.cancelEnrolmentModal.text2')}</p>
      <ul className={styles.list}>
        <li>
          <strong>{name}</strong>
        </li>
      </ul>
      <div className={styles.modalButtonWrapper}>
        <Button
          disabled={isSaving}
          iconLeft={
            isSaving ? (
              <LoadingSpinner
                className={styles.loadingSpinner}
                isLoading={isSaving}
                small={true}
              />
            ) : (
              <IconCross />
            )
          }
          onClick={handleCancel}
          type="button"
          variant="danger"
        >
          {t('enrolment.cancelEnrolmentModal.buttonCancel')}
        </Button>
        <Button
          disabled={isSaving}
          onClick={handleClose}
          theme="black"
          type="button"
          variant="secondary"
        >
          {t('common.cancel')}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmCancelModal;
