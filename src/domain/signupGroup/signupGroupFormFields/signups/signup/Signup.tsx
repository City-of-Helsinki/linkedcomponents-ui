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
import { ATTENDEE_FIELDS } from '../../../../enrolment/constants';
import { useEnrolmentPageContext } from '../../../../enrolment/enrolmentPageContext/hooks/useEnrolmentPageContext';
import { AttendeeFields } from '../../../../enrolment/types';
import {
  isDateOfBirthFieldRequired,
  isEnrolmentFieldRequired,
} from '../../../../enrolment/utils';
import styles from './signup.module.scss';
import SignupAccordion from './signupAccordion/SignupAccordion';

type Props = {
  disabled?: boolean;
  index: number;
  onDelete: () => void;
  registration: RegistrationFieldsFragment;
  showDelete: boolean;
  signup: AttendeeFields;
  signupPath: string;
};

const getFieldName = (attendeePath: string, field: string) =>
  `${attendeePath}.${field}`;

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
    t('enrolment.form.attendeeDefaultTitle', { index: index + 1 });

  return (
    <SignupAccordion
      deleteButton={
        showDelete && !disabled ? (
          <button
            aria-label={getValue(t('enrolment.form.buttonDeleteAttendee'), '')}
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
              name={getFieldName(signupPath, ATTENDEE_FIELDS.FIRST_NAME)}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelFirstName`)}
              placeholder={t(`enrolment.form.placeholderFirstName`)}
              required={isEnrolmentFieldRequired(
                registration,
                ATTENDEE_FIELDS.FIRST_NAME
              )}
            />
            <Field
              name={getFieldName(signupPath, ATTENDEE_FIELDS.LAST_NAME)}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelLastName`)}
              placeholder={t(`enrolment.form.placeholderLastName`)}
              required={isEnrolmentFieldRequired(
                registration,
                ATTENDEE_FIELDS.LAST_NAME
              )}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className={styles.streetAddressRow}>
            <Field
              name={getFieldName(signupPath, ATTENDEE_FIELDS.STREET_ADDRESS)}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelStreetAddress`)}
              placeholder={t(`enrolment.form.placeholderStreetAddress`)}
              required={isEnrolmentFieldRequired(
                registration,
                ATTENDEE_FIELDS.STREET_ADDRESS
              )}
            />
            <Field
              name={getFieldName(signupPath, ATTENDEE_FIELDS.DATE_OF_BIRTH)}
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
              name={getFieldName(signupPath, ATTENDEE_FIELDS.ZIPCODE)}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelZipcode`)}
              placeholder={t(`enrolment.form.placeholderZipcode`)}
              required={isEnrolmentFieldRequired(
                registration,
                ATTENDEE_FIELDS.ZIPCODE
              )}
            />
            <Field
              name={getFieldName(signupPath, ATTENDEE_FIELDS.CITY)}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelCity`)}
              placeholder={t(`enrolment.form.placeholderCity`)}
              required={isEnrolmentFieldRequired(
                registration,
                ATTENDEE_FIELDS.CITY
              )}
            />
          </div>
        </FormGroup>
        <Field
          name={getFieldName(signupPath, ATTENDEE_FIELDS.EXTRA_INFO)}
          className={styles.extraInfoField}
          component={TextAreaField}
          disabled={disabled}
          label={t(`enrolment.form.labelAttendeeExtraInfo`)}
          placeholder={t(`enrolment.form.placeholderAttendeeExtraInfo`)}
          required={isEnrolmentFieldRequired(
            registration,
            ATTENDEE_FIELDS.EXTRA_INFO
          )}
        />
      </Fieldset>
    </SignupAccordion>
  );
};

export default Signup;
