import { FastField, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../../common/components/button/Button';
import CheckboxGroupField from '../../../../../common/components/formFields/CheckboxGroupField';
import DatepickerField from '../../../../../common/components/formFields/DatepickerField';
import NumberInputField from '../../../../../common/components/formFields/NumberInputField';
import TimepickerField from '../../../../../common/components/formFields/TimepickerField';
import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import { WEEK_DAY } from '../../../../../constants';
import {
  RECURRING_EVENT_FIELDS,
  RECURRING_EVENT_INITIAL_VALUES,
} from '../../../constants';
import styles from '../../../eventPage.module.scss';
import { RecurringEventSettings } from '../../../types';
import { createRecurringEventValidationSchema } from '../../../utils';

interface Props {
  onSubmit: (values: RecurringEventSettings) => void;
  type: string;
}

const RecurringEventsForm: React.FC<Props> = ({ onSubmit, type }) => {
  const { t } = useTranslation();
  const weekDayOptions = Object.values(WEEK_DAY).map((weekday) => ({
    label: t(`form.weekDayAbbreviation.${weekday}`),
    value: weekday,
  }));

  return (
    <Formik
      initialValues={RECURRING_EVENT_INITIAL_VALUES}
      onSubmit={onSubmit}
      validationSchema={createRecurringEventValidationSchema}
    >
      {() => {
        return (
          <Form>
            <FormGroup>
              <div className={styles.splittedRow}>
                <div>
                  <h3>{t('event.form.titleRecurringEventRepeatInterval')}</h3>
                  <FastField
                    component={NumberInputField}
                    helperText={t(
                      `event.form.helperRecurringEventRepeatInterval`
                    )}
                    label={t(
                      `event.form.labelRecurringEventRepeatInterval.${type}`
                    )}
                    min={1}
                    max={4}
                    name={RECURRING_EVENT_FIELDS.REPEAT_INTERVAL}
                    required={true}
                  />
                </div>
                <div>
                  <h3>{t('event.form.titleRecurringEventRepeatDays')}</h3>
                  <FastField
                    component={CheckboxGroupField}
                    columns={4}
                    name={RECURRING_EVENT_FIELDS.REPEAT_DAYS}
                    options={weekDayOptions}
                  />
                </div>
              </div>
            </FormGroup>
            <h3>{t('event.form.titleRecurringEventStarts')}</h3>
            <FormGroup>
              <div className={styles.splittedRow}>
                <div>
                  <FastField
                    component={DatepickerField}
                    name={RECURRING_EVENT_FIELDS.START_DATE}
                    label={t('event.form.labelRecurringEventStartDate')}
                    placeholder={t('common.placeholderDate')}
                    required={true}
                    timeSelector={false}
                  />
                </div>
                <div>
                  <FastField
                    component={DatepickerField}
                    name={RECURRING_EVENT_FIELDS.END_DATE}
                    label={t('event.form.labelRecurringEventEndDate')}
                    placeholder={t('common.placeholderDate')}
                    required={true}
                    timeSelector={false}
                  />
                </div>
              </div>
            </FormGroup>
            <FormGroup>
              <div className={styles.splittedRow}>
                <div>
                  <FastField
                    component={TimepickerField}
                    name={RECURRING_EVENT_FIELDS.START_TIME}
                    label={t(`event.form.labelRecurringEventStartTime.${type}`)}
                    placeholder={t('common.placeholderTime')}
                    required={true}
                  />
                </div>
                <div>
                  <FastField
                    component={TimepickerField}
                    name={RECURRING_EVENT_FIELDS.END_TIME}
                    label={t(`event.form.labelRecurringEventEndTime.${type}`)}
                    placeholder={t('common.placeholderTime')}
                    required={true}
                  />
                </div>
              </div>
            </FormGroup>
            <FormGroup className={styles.buttonWrapper}>
              <div className={styles.splittedRow}>
                <div></div>
                <div>
                  <Button fullWidth={true} type="submit">
                    {t(`event.form.buttonAddRecurringEvent.${type}`)}
                  </Button>
                </div>
              </div>
            </FormGroup>
          </Form>
        );
      }}
    </Formik>
  );
};

export default RecurringEventsForm;
