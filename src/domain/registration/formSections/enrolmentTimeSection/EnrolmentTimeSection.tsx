import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DatepickerField from '../../../../common/components/formFields/datepickerField/DatepickerField';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import { REGISTRATION_FIELDS } from '../../constants';
import styles from '../../registrationPage.module.scss';

interface Props {
  isEditingAllowed: boolean;
}

const EnrolmentTimeSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();
  const [{ value: enrolmentStartTime }] = useField({
    name: REGISTRATION_FIELDS.ENROLMENT_START_TIME,
  });

  return (
    <>
      <FieldRow>
        <FieldColumn>
          <div className={styles.splittedRow}>
            <Field
              component={DatepickerField}
              disabled={!isEditingAllowed}
              label={t(`registration.form.labelEnrolmentStartTime`)}
              name={REGISTRATION_FIELDS.ENROLMENT_START_TIME}
              placeholder={t(`common.placeholderDateTime`)}
              required={true}
              timeSelector={true}
            />
            <Field
              component={DatepickerField}
              disabled={!isEditingAllowed}
              label={t(`registration.form.labelEnrolmentEndTime`)}
              minBookingDate={enrolmentStartTime}
              name={REGISTRATION_FIELDS.ENROLMENT_END_TIME}
              placeholder={t(`common.placeholderDateTime`)}
              required={true}
              timeSelector={true}
            />
          </div>
        </FieldColumn>
      </FieldRow>
    </>
  );
};

export default EnrolmentTimeSection;
