import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import NumberInputField from '../../../../common/components/formFields/NumberInputField';
import FieldColumn from '../../../app/layout/FieldColumn';
import FieldRow from '../../../app/layout/FieldRow';
import { REGISTRATION_FIELDS } from '../../constants';
import styles from '../../registrationPage.module.scss';

interface Props {
  isEditingAllowed: boolean;
}

const AttendeeCapacitySection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  return (
    <>
      <FieldRow>
        <FieldColumn>
          <div className={styles.splittedRow}>
            <Field
              component={NumberInputField}
              label={t(`registration.form.labelMinimumAttendeeCapacity`)}
              min={0}
              name={REGISTRATION_FIELDS.MINIMUM_ATTENDEE_CAPACITY}
              placeholder={0}
              readOnly={!isEditingAllowed}
            />
            <Field
              component={NumberInputField}
              label={t(`registration.form.labelMaximumAttendeeCapacity`)}
              min={0}
              name={REGISTRATION_FIELDS.MAXIMUM_ATTENDEE_CAPACITY}
              placeholder={0}
              readOnly={!isEditingAllowed}
            />
          </div>
        </FieldColumn>
      </FieldRow>
    </>
  );
};

export default AttendeeCapacitySection;
