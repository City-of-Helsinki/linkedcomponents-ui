import { Field } from 'formik';
import { Fieldset, IconTrash } from 'hds-react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import DateInputField from '../../../../../common/components/formFields/dateInputField/DateInputField2';
import TextAreaField from '../../../../../common/components/formFields/textAreaField/TextAreaField';
import TextInputField from '../../../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import { ATTENDEE_FIELDS } from '../../../constants';
import EnrolmentPageContext from '../../../enrolmentPageContext/EnrolmentPageContext';
import { AttendeeFields } from '../../../types';
import styles from './attendee.module.scss';
import AttendeeAccordion from './attendeeAccordion/AttendeeAccordion';

type Props = {
  attendee: AttendeeFields;
  attendeePath: string;
  disabled?: boolean;
  index: number;
  onDelete: () => void;
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
  showDelete,
}) => {
  const { t } = useTranslation();
  const { openParticipant, toggleOpenParticipant } =
    useContext(EnrolmentPageContext);

  return (
    <AttendeeAccordion
      deleteButton={
        showDelete && !disabled ? (
          <button
            aria-label={t('enrolment.form.buttonDeleteAttendee')}
            className={styles.deleteButton}
            onClick={onDelete}
            type="button"
          >
            <IconTrash />
          </button>
        ) : undefined
      }
      onClick={() => toggleOpenParticipant(index)}
      open={openParticipant === index}
      toggleButtonLabel={
        attendee.name ||
        t('enrolment.form.attendeeDefaultTitle', { index: index + 1 })
      }
    >
      <Fieldset heading={t(`enrolment.form.titleBasicInfo`)}>
        <FormGroup>
          <Field
            name={getFieldName(attendeePath, ATTENDEE_FIELDS.NAME)}
            component={TextInputField}
            disabled={disabled}
            label={t(`enrolment.form.labelName`)}
            placeholder={t(`enrolment.form.placeholderName`)}
            required
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
              required
            />
            <Field
              name={getFieldName(attendeePath, ATTENDEE_FIELDS.DATE_OF_BIRTH)}
              component={DateInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelDateOfBirth`)}
              placeholder={t('common.placeholderDate')}
              required
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className={styles.zipRow}>
            <Field
              name={getFieldName(attendeePath, ATTENDEE_FIELDS.ZIP)}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelZip`)}
              placeholder={t(`enrolment.form.placeholderZip`)}
              required
            />
            <Field
              name={getFieldName(attendeePath, ATTENDEE_FIELDS.CITY)}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelCity`)}
              placeholder={t(`enrolment.form.placeholderCity`)}
              required
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
        />
      </Fieldset>
    </AttendeeAccordion>
  );
};

export default Attendee;
