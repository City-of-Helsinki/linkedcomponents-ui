import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import NumberInputField from '../../../../common/components/formFields/NumberInputField';
import FieldColumn from '../../../app/layout/FieldColumn';
import FieldRow from '../../../app/layout/FieldRow';
import { REGISTRATION_FIELDS } from '../../constants';
import styles from '../../registrationPage.module.scss';

const AttendeeCountSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <FieldRow>
        <FieldColumn>
          <div className={styles.splittedRow}>
            <Field
              name={REGISTRATION_FIELDS.MINIMUM_ATTENDEE_COUNT}
              component={NumberInputField}
              label={t(`registration.form.labelMinimumAttendeeCount`)}
              min={0}
              placeholder={0}
            />
            <Field
              name={REGISTRATION_FIELDS.MAXIMUM_ATTENDEE_COUNT}
              component={NumberInputField}
              label={t(`registration.form.labelMaximumAttendeeCount`)}
              min={0}
              placeholder={0}
            />
          </div>
        </FieldColumn>
      </FieldRow>
    </>
  );
};

export default AttendeeCountSection;
