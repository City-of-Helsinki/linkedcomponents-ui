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
  SignupGroupFieldsFragment,
} from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import skipFalsyType from '../../../../utils/skipFalsyType';
import { getSignupFields } from '../../../signups/utils';

type ConfirmDeleteSignupModalProps = {
  registration: RegistrationFieldsFragment;
  signup: SignupFieldsFragment;
  signupGroup?: undefined;
};

type ConfirmDeleteSignupGroupModalProps = {
  registration: RegistrationFieldsFragment;
  signupGroup: SignupGroupFieldsFragment;
  signup?: undefined;
};

export type ConfirmDeleteSignupOrSignupGroupModalProps = (
  | ConfirmDeleteSignupModalProps
  | ConfirmDeleteSignupGroupModalProps
) &
  CommonConfirmModalProps;

const SignupName: React.FC<{
  registration: RegistrationFieldsFragment;
  signup: SignupFieldsFragment;
}> = ({ registration, signup }) => {
  const locale = useLocale();
  const { fullName } = getSignupFields({
    language: locale,
    registration,
    signup,
  });

  return (
    <li key={signup.id}>
      <strong>{fullName}</strong>
    </li>
  );
};

const ConfirmDeleteSignupOrSignupGroupModal: React.FC<
  ConfirmDeleteSignupOrSignupGroupModalProps
> = ({ registration, signup, signupGroup, ...props }) => {
  const { t } = useTranslation();

  return (
    <ConfirmModal
      {...props}
      bodyContent={
        <>
          <p>{t('signup.deleteSignupModal.text2')}</p>
          <ul className={styles.list}>
            {signupGroup?.signups?.filter(skipFalsyType).map((signup) => (
              <SignupName
                key={signup.id}
                registration={registration}
                signup={signup}
              />
            ))}
            {signup && (
              <SignupName registration={registration} signup={signup} />
            )}
          </ul>
        </>
      }
      confirmButtonIcon={<IconCross aria-hidden={true} />}
      confirmButtonText={t('signup.deleteSignupModal.buttonCancel')}
      description={t('signup.deleteSignupModal.text1')}
      heading={t('signup.deleteSignupModal.title')}
      id="confirm-signup-cancel-modal"
      variant="danger"
    />
  );
};

export default ConfirmDeleteSignupOrSignupGroupModal;
