import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import NumberInputField from '../../../../common/components/formFields/NumberInputField';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
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
              disabled={!isEditingAllowed}
              label={t(`registration.form.labelMinimumAttendeeCapacity`)}
              min={0}
              name={REGISTRATION_FIELDS.MINIMUM_ATTENDEE_CAPACITY}
              placeholder={0}
            />
            <Field
              component={NumberInputField}
              disabled={!isEditingAllowed}
              label={t(`registration.form.labelMaximumAttendeeCapacity`)}
              min={0}
              name={REGISTRATION_FIELDS.MAXIMUM_ATTENDEE_CAPACITY}
              placeholder={0}
            />
          </div>
        </FieldColumn>
      </FieldRow>
    </>
  );
};

export default AttendeeCapacitySection;
