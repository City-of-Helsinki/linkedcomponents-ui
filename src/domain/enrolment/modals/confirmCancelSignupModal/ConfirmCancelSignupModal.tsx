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
import { getSignupFields } from '../../../signups/utils';

export type ConfirmCancelSignupModalProps = {
  registration: RegistrationFieldsFragment;
  signup: SignupFieldsFragment;
} & CommonConfirmModalProps;

const ConfirmCancelSignupModal: React.FC<ConfirmCancelSignupModalProps> = ({
  registration,
  signup,
  ...props
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { fullName } = getSignupFields({
    language: locale,
    registration,
    signup,
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
      id="confirm-signup-cancel-modal"
      variant="danger"
    />
  );
};

export default ConfirmCancelSignupModal;
