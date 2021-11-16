import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import NumberInputField from '../../../../common/components/formFields/NumberInputField';
import FieldColumn from '../../../app/layout/FieldColumn';
import FieldRow from '../../../app/layout/FieldRow';
import { REGISTRATION_FIELDS } from '../../constants';
import styles from '../../registrationPage.module.scss';

const AttendeeCapacitySection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <FieldRow>
        <FieldColumn>
          <div className={styles.splittedRow}>
            <Field
              name={REGISTRATION_FIELDS.MINIMUM_ATTENDEE_CAPACITY}
              component={NumberInputField}
              label={t(`registration.form.labelMinimumAttendeeCapacity`)}
              min={0}
              placeholder={0}
            />
            <Field
              name={REGISTRATION_FIELDS.MAXIMUM_ATTENDEE_CAPACITY}
              component={NumberInputField}
              label={t(`registration.form.labelMaximumAttendeeCapacity`)}
              min={0}
              placeholder={0}
            />
          </div>
        </FieldColumn>
      </FieldRow>
    </>
  );
};

export default AttendeeCapacitySection;
