import { Field } from 'formik';
import { Fieldset, IconTrash } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DateInputField from '../../../../../common/components/formFields/dateInputField/DateInputField';
import TextAreaField from '../../../../../common/components/formFields/textAreaField/TextAreaField';
import TextInputField from '../../../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import { RegistrationFieldsFragment } from '../../../../../generated/graphql';
import getValue from '../../../../../utils/getValue';
import skipFalsyType from '../../../../../utils/skipFalsyType';
import { SIGNUP_FIELDS } from '../../../../enrolment/constants';
import { useEnrolmentPageContext } from '../../../../enrolment/enrolmentPageContext/hooks/useEnrolmentPageContext';
import { SignupFields } from '../../../../enrolment/types';
import {
  isDateOfBirthFieldRequired,
  isSignupFieldRequired,
} from '../../../../enrolment/utils';
import styles from './signup.module.scss';
import SignupAccordion from './signupAccordion/SignupAccordion';

type Props = {
  disabled?: boolean;
  index: number;
  onDelete: () => void;
  registration: RegistrationFieldsFragment;
  showDelete: boolean;
  signup: SignupFields;
  signupPath: string;
};

const getFieldName = (signupPath: string, field: string) =>
  `${signupPath}.${field}`;

const Signup: React.FC<Props> = ({
  disabled,
  index,
  onDelete,
  registration,
  showDelete,
  signup,
  signupPath,
}) => {
  const { t } = useTranslation();
  const { openParticipant, toggleOpenParticipant } = useEnrolmentPageContext();
  const labelText =
    [signup.firstName, signup.lastName].filter(skipFalsyType).join(' ') ||
    t('enrolment.form.signupDefaultTitle', { index: index + 1 });

  return (
    <SignupAccordion
      deleteButton={
        showDelete && !disabled ? (
          <button
            aria-label={getValue(t('enrolment.form.buttonDeleteSignup'), '')}
            className={styles.deleteButton}
            onClick={onDelete}
            type="button"
          >
            <IconTrash />
          </button>
        ) : undefined
      }
      inWaitingList={signup.inWaitingList}
      onClick={() => toggleOpenParticipant(index)}
      open={openParticipant === index}
      toggleButtonLabel={labelText}
    >
      <Fieldset heading={t(`enrolment.form.titleBasicInfo`)}>
        <FormGroup>
          <div className={styles.nameRow}>
            <Field
              name={getFieldName(signupPath, SIGNUP_FIELDS.FIRST_NAME)}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelFirstName`)}
              placeholder={t(`enrolment.form.placeholderFirstName`)}
              required={isSignupFieldRequired(
                registration,
                SIGNUP_FIELDS.FIRST_NAME
              )}
            />
            <Field
              name={getFieldName(signupPath, SIGNUP_FIELDS.LAST_NAME)}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelLastName`)}
              placeholder={t(`enrolment.form.placeholderLastName`)}
              required={isSignupFieldRequired(
                registration,
                SIGNUP_FIELDS.LAST_NAME
              )}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className={styles.streetAddressRow}>
            <Field
              name={getFieldName(signupPath, SIGNUP_FIELDS.STREET_ADDRESS)}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelStreetAddress`)}
              placeholder={t(`enrolment.form.placeholderStreetAddress`)}
              required={isSignupFieldRequired(
                registration,
                SIGNUP_FIELDS.STREET_ADDRESS
              )}
            />
            <Field
              name={getFieldName(signupPath, SIGNUP_FIELDS.DATE_OF_BIRTH)}
              component={DateInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelDateOfBirth`)}
              placeholder={t('common.placeholderDate')}
              required={isDateOfBirthFieldRequired(registration)}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className={styles.zipRow}>
            <Field
              name={getFieldName(signupPath, SIGNUP_FIELDS.ZIPCODE)}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelZipcode`)}
              placeholder={t(`enrolment.form.placeholderZipcode`)}
              required={isSignupFieldRequired(
                registration,
                SIGNUP_FIELDS.ZIPCODE
              )}
            />
            <Field
              name={getFieldName(signupPath, SIGNUP_FIELDS.CITY)}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelCity`)}
              placeholder={t(`enrolment.form.placeholderCity`)}
              required={isSignupFieldRequired(registration, SIGNUP_FIELDS.CITY)}
            />
          </div>
        </FormGroup>
        <Field
          name={getFieldName(signupPath, SIGNUP_FIELDS.EXTRA_INFO)}
          className={styles.extraInfoField}
          component={TextAreaField}
          disabled={disabled}
          label={t(`enrolment.form.labelSignupExtraInfo`)}
          placeholder={t(`enrolment.form.placeholderSignupExtraInfo`)}
          required={isSignupFieldRequired(
            registration,
            SIGNUP_FIELDS.EXTRA_INFO
          )}
        />
      </Fieldset>
    </SignupAccordion>
  );
};

export default Signup;
