import { IconCross } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmModal, {
  CommonConfirmModalProps,
} from '../../../../common/components/dialog/confirmModal/ConfirmModal';
import styles from '../../../../common/components/dialog/dialog.module.scss';
import {
  RegistrationFieldsFragment,
  SignupFieldsFragment,
} from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import { getEnrolmentFields } from '../../../enrolments/utils';

export type ConfirmCancelEnrolmentModalProps = {
  enrolment: SignupFieldsFragment;
  registration: RegistrationFieldsFragment;
} & CommonConfirmModalProps;

const ConfirmCancelEnrolmentModal: React.FC<
  ConfirmCancelEnrolmentModalProps
> = ({ enrolment, registration, ...props }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { fullName } = getEnrolmentFields({
    enrolment,
    language: locale,
    registration,
  });

  return (
    <ConfirmModal
      {...props}
      bodyContent={
        <>
          <p>{t('enrolment.cancelEnrolmentModal.text2')}</p>
          <ul className={styles.list}>
            <li>
              <strong>{fullName}</strong>
            </li>
          </ul>
        </>
      }
      confirmButtonIcon={<IconCross aria-hidden={true} />}
      confirmButtonText={t('enrolment.cancelEnrolmentModal.buttonCancel')}
      description={t('enrolment.cancelEnrolmentModal.text1')}
      heading={t('enrolment.cancelEnrolmentModal.title')}
      id="confirm-enrolment-cancel-modal"
      variant="danger"
    />
  );
};

export default ConfirmCancelEnrolmentModal;
