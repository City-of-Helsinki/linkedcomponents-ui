import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DateInputField from '../../../../common/components/formFields/dateInputField/DateInputField2';
import TimeInputField from '../../../../common/components/formFields/timeInputField/TimeInputField';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import { REGISTRATION_FIELDS } from '../../constants';
import styles from '../../registrationPage.module.scss';

interface Props {
  isEditingAllowed: boolean;
}

const EnrolmentTimeSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  return (
    <>
      <FieldRow>
        <FieldColumn>
          <div className={styles.splittedRow}>
            <Field
              component={DateInputField}
              className={styles.noLineBreakInLabel}
              disabled={!isEditingAllowed}
              label={t(`registration.form.labelEnrolmentStartTimeDate`)}
              name={REGISTRATION_FIELDS.ENROLMENT_START_TIME_DATE}
              placeholder={t(`common.placeholderDate`)}
              required={true}
            />
            <Field
              component={TimeInputField}
              className={styles.noLineBreakInLabel}
              disabled={!isEditingAllowed}
              label={t(`registration.form.labelEnrolmentStartTimeTime`)}
              name={REGISTRATION_FIELDS.ENROLMENT_START_TIME_TIME}
              placeholder={t(`common.placeholderTime`)}
              required={true}
            />
          </div>
        </FieldColumn>
      </FieldRow>
      <FieldRow>
        <FieldColumn>
          <div className={styles.splittedRow}>
            <Field
              component={DateInputField}
              className={styles.noLineBreakInLabel}
              disabled={!isEditingAllowed}
              label={t(`registration.form.labelEnrolmentEndTimeDate`)}
              name={REGISTRATION_FIELDS.ENROLMENT_END_TIME_DATE}
              placeholder={t(`common.placeholderDate`)}
              required={true}
            />
            <Field
              component={TimeInputField}
              className={styles.noLineBreakInLabel}
              disabled={!isEditingAllowed}
              label={t(`registration.form.labelEnrolmentEndTimeTime`)}
              name={REGISTRATION_FIELDS.ENROLMENT_END_TIME_TIME}
              placeholder={t(`common.placeholderTime`)}
              required={true}
            />
          </div>
        </FieldColumn>
      </FieldRow>
    </>
  );
};

export default EnrolmentTimeSection;
