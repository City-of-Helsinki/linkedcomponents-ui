import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DateInputField from '../../../../common/components/formFields/dateInputField/DateInputField';
import NumberInputField from '../../../../common/components/formFields/numberInputField/NumberInputField';
import TimeInputField from '../../../../common/components/formFields/timeInputField/TimeInputField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import Notification from '../../../../common/components/notification/Notification';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import { EVENT_FIELDS } from '../../constants';
import styles from '../../eventPage.module.scss';

interface Props {
  isEditingAllowed: boolean;
}

const AdditionalInfoSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();
  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });

  return (
    <>
      <h3>{t(`event.form.titleAudienceAge`)}</h3>
      <FieldRow
        notification={
          <Notification
            className={styles.notification}
            label={t(`event.form.titleAudienceAge`)}
            type="info"
          >
            <p>{t(`event.form.infoTextAudienceAge.${type}`)}</p>
          </Notification>
        }
      >
        <FieldColumn>
          <div className={styles.numberRow}>
            <FormGroup>
              <Field
                component={NumberInputField}
                disabled={!isEditingAllowed}
                label={t(`event.form.labelAudienceMinAge`)}
                min={0}
                name={EVENT_FIELDS.AUDIENCE_MIN_AGE}
                placeholder={0}
              />
            </FormGroup>
            <FormGroup>
              <Field
                component={NumberInputField}
                disabled={!isEditingAllowed}
                label={t(`event.form.labelAudienceMaxAge`)}
                min={0}
                name={EVENT_FIELDS.AUDIENCE_MAX_AGE}
                placeholder={0}
              />
            </FormGroup>
          </div>
        </FieldColumn>
      </FieldRow>

      <h3 className={styles.noTopMargin}>
        {t(`event.form.titleEnrolmentTime`)}
      </h3>
      <FieldRow
        notification={
          <Notification
            className={styles.notification}
            label={t(`event.form.titleEnrolmentTime`)}
            type="info"
          >
            <p>{t(`event.form.infoTextEnrolmentTime.${type}`)}</p>
          </Notification>
        }
      >
        <FieldColumn>
          <FormGroup>
            <Field
              component={DateInputField}
              disabled={!isEditingAllowed}
              label={t(`event.form.labelEnrolmentStartTimeDate`)}
              name={EVENT_FIELDS.ENROLMENT_START_TIME_DATE}
              placeholder={t(`common.placeholderDate`)}
            />
          </FormGroup>
          <FormGroup>
            <Field
              component={TimeInputField}
              disabled={!isEditingAllowed}
              label={t(`event.form.labelEnrolmentStartTimeTime`)}
              name={EVENT_FIELDS.ENROLMENT_START_TIME_TIME}
              placeholder={t(`common.placeholderTime`)}
            />
          </FormGroup>
        </FieldColumn>
      </FieldRow>
      <FieldRow>
        <FieldColumn>
          <FormGroup>
            <Field
              component={DateInputField}
              disabled={!isEditingAllowed}
              label={t(`event.form.labelEnrolmentEndTimeDate`)}
              name={EVENT_FIELDS.ENROLMENT_END_TIME_DATE}
              placeholder={t(`common.placeholderDate`)}
            />
          </FormGroup>
          <FormGroup>
            <Field
              component={TimeInputField}
              disabled={!isEditingAllowed}
              label={t(`event.form.labelEnrolmentEndTimeTime`)}
              name={EVENT_FIELDS.ENROLMENT_END_TIME_TIME}
              placeholder={t(`common.placeholderTime`)}
            />
          </FormGroup>
        </FieldColumn>
      </FieldRow>

      <h3 className={styles.noTopMargin}>
        {t(`event.form.titleAttendeeCapacity`)}
      </h3>
      <FieldRow
        notification={
          <Notification
            className={styles.notification}
            label={t(`event.form.titleAttendeeCapacity`)}
            type="info"
          >
            <p>{t(`event.form.infoTextAttendeeCapacity.${type}`)}</p>
          </Notification>
        }
      >
        <FieldColumn>
          <div className={styles.numberRow}>
            <FormGroup>
              <Field
                component={NumberInputField}
                disabled={!isEditingAllowed}
                label={t(`event.form.labelMinimumAttendeeCapacity`)}
                min={0}
                name={EVENT_FIELDS.MINIMUM_ATTENDEE_CAPACITY}
                placeholder={0}
              />
            </FormGroup>
            <FormGroup>
              <Field
                component={NumberInputField}
                disabled={!isEditingAllowed}
                label={t(`event.form.labelMaximumAttendeeCapacity`)}
                min={0}
                name={EVENT_FIELDS.MAXIMUM_ATTENDEE_CAPACITY}
                placeholder={0}
              />
            </FormGroup>
          </div>
        </FieldColumn>
      </FieldRow>
    </>
  );
};

export default AdditionalInfoSection;
