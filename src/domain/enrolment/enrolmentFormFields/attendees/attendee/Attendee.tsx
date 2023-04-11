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
import { ATTENDEE_FIELDS } from '../../../constants';
import { useEnrolmentPageContext } from '../../../enrolmentPageContext/hooks/useEnrolmentPageContext';
import { AttendeeFields } from '../../../types';
import {
  isDateOfBirthFieldRequired,
  isEnrolmentFieldRequired,
} from '../../../utils';
import styles from './attendee.module.scss';
import AttendeeAccordion from './attendeeAccordion/AttendeeAccordion';

type Props = {
  attendee: AttendeeFields;
  attendeePath: string;
  disabled?: boolean;
  index: number;
  onDelete: () => void;
  registration: RegistrationFieldsFragment;
  showDelete: boolean;
};

const getFieldName = (attendeePath: string, field: string) =>
  `${attendeePath}.${field}`;

const Attendee: React.FC<Props> = ({
  attendee,
  attendeePath,
  disabled,
  index,
  onDelete,
  registration,
  showDelete,
}) => {
  const { t } = useTranslation();
  const { openParticipant, toggleOpenParticipant } = useEnrolmentPageContext();
  const labelText =
    attendee.name ||
    t('enrolment.form.attendeeDefaultTitle', { index: index + 1 });

  return (
    <AttendeeAccordion
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
      inWaitingList={attendee.inWaitingList}
      onClick={() => toggleOpenParticipant(index)}
      open={openParticipant === index}
      toggleButtonLabel={labelText}
    >
      <Fieldset heading={t(`enrolment.form.titleBasicInfo`)}>
        <FormGroup>
          <Field
            name={getFieldName(attendeePath, ATTENDEE_FIELDS.NAME)}
            component={TextInputField}
            disabled={disabled}
            label={t(`enrolment.form.labelName`)}
            placeholder={t(`enrolment.form.placeholderName`)}
            required={isEnrolmentFieldRequired(
              registration,
              ATTENDEE_FIELDS.NAME
            )}
          />
        </FormGroup>
        <FormGroup>
          <div className={styles.streetAddressRow}>
            <Field
              name={getFieldName(attendeePath, ATTENDEE_FIELDS.STREET_ADDRESS)}
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
              name={getFieldName(attendeePath, ATTENDEE_FIELDS.DATE_OF_BIRTH)}
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
              name={getFieldName(attendeePath, ATTENDEE_FIELDS.ZIPCODE)}
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
              name={getFieldName(attendeePath, ATTENDEE_FIELDS.CITY)}
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
          name={getFieldName(attendeePath, ATTENDEE_FIELDS.EXTRA_INFO)}
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
    </AttendeeAccordion>
  );
};

export default Attendee;
