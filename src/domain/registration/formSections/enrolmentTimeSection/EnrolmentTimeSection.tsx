import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DatepickerField from '../../../../common/components/formFields/DatepickerField';
import FieldColumn from '../../../app/layout/FieldColumn';
import FieldRow from '../../../app/layout/FieldRow';
import { REGISTRATION_FIELDS } from '../../constants';
import styles from '../../registrationPage.module.scss';

const EnrolmentTimeSection: React.FC = () => {
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
              name={REGISTRATION_FIELDS.ENROLMENT_START_TIME}
              component={DatepickerField}
              label={t(`registration.form.labelEnrolmentStartTime`)}
              placeholder={t(`common.placeholderDateTime`)}
              timeSelector={true}
            />
            <Field
              name={REGISTRATION_FIELDS.ENROLMENT_END_TIME}
              component={DatepickerField}
              label={t(`registration.form.labelEnrolmentEndTime`)}
              minBookingDate={enrolmentStartTime}
              placeholder={t(`common.placeholderDateTime`)}
              timeSelector={true}
            />
          </div>
        </FieldColumn>
      </FieldRow>
    </>
  );
};

export default EnrolmentTimeSection;
