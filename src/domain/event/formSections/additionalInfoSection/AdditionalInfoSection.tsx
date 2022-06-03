import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DatepickerField from '../../../../common/components/formFields/datepickerField/DatepickerField';
import NumberInputField from '../../../../common/components/formFields/numberInputField/NumberInputField';
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
  const [{ value: enrolmentStartTime }] = useField({
    name: EVENT_FIELDS.ENROLMENT_START_TIME,
  });

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
              component={DatepickerField}
              disabled={!isEditingAllowed}
              label={t(`event.form.labelEnrolmentStartTime`)}
              name={EVENT_FIELDS.ENROLMENT_START_TIME}
              placeholder={t(`common.placeholderDateTime`)}
              timeSelector={true}
            />
          </FormGroup>
          <FormGroup>
            <Field
              component={DatepickerField}
              disabled={!isEditingAllowed}
              label={t(`event.form.labelEnrolmentEndTime`)}
              minBookingDate={enrolmentStartTime}
              name={EVENT_FIELDS.ENROLMENT_END_TIME}
              placeholder={t(`common.placeholderDateTime`)}
              timeSelector={true}
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
