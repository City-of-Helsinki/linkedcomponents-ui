import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import DateInputField from '../../../../common/components/formFields/dateInputField/DateInputField';
import NumberInputField from '../../../../common/components/formFields/numberInputField/NumberInputField';
import TimeInputField from '../../../../common/components/formFields/timeInputField/TimeInputField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import HeadingWithTooltip from '../../../../common/components/headingWithTooltip/HeadingWithTooltip';
import Notification from '../../../../common/components/notification/Notification';
import getDatePickerInitialMonth from '../../../../utils/getDatePickerInitialMonth';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import SplittedRow from '../../../app/layout/splittedRow/SplittedRow';
import useUser from '../../../user/hooks/useUser';
import { EVENT_FIELDS } from '../../constants';
import styles from '../../eventPage.module.scss';
import {
  showNotificationInstructions,
  showTooltipInstructions,
} from '../../utils';
import AttendeeCapacityInstructions from './attendeeCapacityInstructions/AttendeeCapacityInstructions';
import AudienceAgeInstructions from './audienceAgeInstructions/AudienceAgeInstructions';
import EnrolmentTimeInstructions from './enrolmentTimeInstructions/EnrolmentTimeInstructions';

export interface AdditionalInfoSectionProps {
  isEditingAllowed: boolean;
  isExternalUser: boolean;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  isEditingAllowed,
  isExternalUser,
}) => {
  const { t } = useTranslation();
  const { user } = useUser();

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const [{ value: enrolmentStartTime }] = useField({
    name: EVENT_FIELDS.ENROLMENT_START_TIME_DATE,
  });

  return (
    <Fieldset heading={t('event.form.sections.additionalInfo')} hideLegend>
      <HeadingWithTooltip
        heading={t('event.form.titleAudienceAge')}
        showTooltip={showTooltipInstructions(user)}
        tag="h3"
        tooltipContent={<AudienceAgeInstructions eventType={type} />}
        tooltipLabel={t('event.form.titleAudienceAge')}
      />
      <FieldRow
        notification={
          showNotificationInstructions(user) ? (
            <Notification
              className={styles.notificationForTitle}
              label={t('event.form.titleAudienceAge')}
              type="info"
            >
              <AudienceAgeInstructions eventType={type} />
            </Notification>
          ) : undefined
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

      <HeadingWithTooltip
        className={styles.noTopMargin}
        heading={t('event.form.titleEnrolmentTime')}
        showTooltip={showTooltipInstructions(user)}
        tag="h3"
        tooltipContent={<EnrolmentTimeInstructions eventType={type} />}
        tooltipLabel={t('event.form.titleEnrolmentTime')}
      />
      <FieldRow
        notification={
          showNotificationInstructions(user) ? (
            <Notification
              className={styles.notificationForTitle}
              label={t(`event.form.titleEnrolmentTime`)}
              type="info"
            >
              <EnrolmentTimeInstructions eventType={type} />
            </Notification>
          ) : undefined
        }
      >
        <FieldColumn>
          <FormGroup>
            <SplittedRow>
              <Field
                component={DateInputField}
                disabled={!isEditingAllowed}
                label={t(`event.form.labelEnrolmentStartTimeDate`)}
                name={EVENT_FIELDS.ENROLMENT_START_TIME_DATE}
                placeholder={t(`common.placeholderDate`)}
              />
              <Field
                component={TimeInputField}
                disabled={!isEditingAllowed}
                label={t(`event.form.labelEnrolmentStartTimeTime`)}
                name={EVENT_FIELDS.ENROLMENT_START_TIME_TIME}
                placeholder={t(`common.placeholderTime`)}
              />
            </SplittedRow>
          </FormGroup>
        </FieldColumn>
      </FieldRow>
      <FieldRow>
        <FieldColumn>
          <FormGroup>
            <SplittedRow>
              <Field
                component={DateInputField}
                disabled={!isEditingAllowed}
                initialMonth={getDatePickerInitialMonth(enrolmentStartTime)}
                label={t(`event.form.labelEnrolmentEndTimeDate`)}
                minDate={enrolmentStartTime ?? null}
                name={EVENT_FIELDS.ENROLMENT_END_TIME_DATE}
                placeholder={t(`common.placeholderDate`)}
              />

              <Field
                component={TimeInputField}
                disabled={!isEditingAllowed}
                label={t(`event.form.labelEnrolmentEndTimeTime`)}
                name={EVENT_FIELDS.ENROLMENT_END_TIME_TIME}
                placeholder={t(`common.placeholderTime`)}
              />
            </SplittedRow>
          </FormGroup>
        </FieldColumn>
      </FieldRow>

      <HeadingWithTooltip
        className={styles.noTopMargin}
        heading={t('event.form.titleAttendeeCapacity')}
        showTooltip={showTooltipInstructions(user)}
        tag="h3"
        tooltipContent={<AttendeeCapacityInstructions eventType={type} />}
        tooltipLabel={t('event.form.titleAttendeeCapacity')}
      />
      <FieldRow
        notification={
          showNotificationInstructions(user) ? (
            <Notification
              className={styles.notificationForTitle}
              label={t('event.form.titleAttendeeCapacity')}
              type="info"
            >
              <AttendeeCapacityInstructions eventType={type} />
            </Notification>
          ) : undefined
        }
      >
        <FieldColumn>
          <div className={styles.numberRow}>
            <FormGroup>
              <Field
                className={styles.fieldWithLongText}
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
                className={styles.fieldWithLongText}
                component={NumberInputField}
                disabled={!isEditingAllowed}
                label={t(`event.form.labelMaximumAttendeeCapacity`)}
                min={0}
                name={EVENT_FIELDS.MAXIMUM_ATTENDEE_CAPACITY}
                placeholder={0}
                required={true}
              />
            </FormGroup>
          </div>
        </FieldColumn>
      </FieldRow>
    </Fieldset>
  );
};

export default AdditionalInfoSection;
