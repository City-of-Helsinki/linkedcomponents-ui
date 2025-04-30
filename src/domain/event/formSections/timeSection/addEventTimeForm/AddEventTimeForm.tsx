import { Field, Formik, FormikHelpers } from 'formik';
import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../../common/components/button/Button';
import DateInputField from '../../../../../common/components/formFields/dateInputField/DateInputField';
import TimeInputField from '../../../../../common/components/formFields/timeInputField/TimeInputField';
import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import { SuperEventType } from '../../../../../generated/graphql';
import getDatePickerInitialMonth from '../../../../../utils/getDatePickerInitialMonth';
import setDateTime from '../../../../../utils/setDateTime';
import SplittedRow from '../../../../app/layout/splittedRow/SplittedRow';
import {
  ADD_EVENT_TIME_FORM_NAME,
  EVENT_TIME_FIELDS,
} from '../../../constants';
import { AddEventTimeFormFields, EventTime } from '../../../types';
import { addEventTimeSchema } from '../../../validation';
import useTimeSectionContext from '../hooks/useTimeSectionContext';

interface Props {
  addEventTime: (eventTime: EventTime) => void;
}

const AddEventTimeForm: React.FC<Props> = ({ addEventTime }) => {
  const { t } = useTranslation();
  const { eventType, isEditingAllowed, savedEvent } = useTimeSectionContext();
  const disabled =
    !isEditingAllowed ||
    (savedEvent && savedEvent.superEventType !== SuperEventType.Recurring);

  const submitAddEventTime = (
    values: AddEventTimeFormFields,
    formikHelpers: FormikHelpers<AddEventTimeFormFields>
  ) => {
    const { resetForm, validateForm } = formikHelpers;

    addEventTime({
      id: null,
      endTime: setDateTime(
        values[ADD_EVENT_TIME_FORM_NAME].endDate as Date,
        values[ADD_EVENT_TIME_FORM_NAME].endTime
      ),
      startTime: setDateTime(
        values[ADD_EVENT_TIME_FORM_NAME].startDate as Date,
        values[ADD_EVENT_TIME_FORM_NAME].startTime
      ),
    });
    resetForm();
    validateForm();
  };

  return (
    <Formik
      initialValues={
        {
          [ADD_EVENT_TIME_FORM_NAME]: {
            endDate: null,
            endTime: '',
            startDate: null,
            startTime: '',
          },
        } as AddEventTimeFormFields
      }
      onSubmit={submitAddEventTime}
      validateOnBlur={false}
      validateOnChange
      validateOnMount
      validationSchema={addEventTimeSchema}
    >
      {({
        handleSubmit,
        isValid,
        values: {
          [ADD_EVENT_TIME_FORM_NAME]: { startDate },
        },
      }) => {
        return (
          <>
            <FormGroup>
              <SplittedRow>
                <Field
                  component={DateInputField}
                  disabled={disabled}
                  label={t(`event.form.labelStartDate.${eventType}`)}
                  name={`${ADD_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.START_DATE}`}
                  placeholder={t('common.placeholderDate')}
                  required={true}
                />
                <Field
                  component={TimeInputField}
                  disabled={disabled}
                  label={t(`event.form.labelStartTime`)}
                  name={`${ADD_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.START_TIME}`}
                  placeholder={t('common.placeholderTime')}
                  required={true}
                />
              </SplittedRow>
            </FormGroup>
            <FormGroup>
              <SplittedRow>
                <Field
                  component={DateInputField}
                  disabled={disabled}
                  initialMonth={getDatePickerInitialMonth(startDate)}
                  minDate={startDate}
                  name={`${ADD_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.END_DATE}`}
                  label={t(`event.form.labelEndDate.${eventType}`)}
                  placeholder={t('common.placeholderDate')}
                  required={true}
                />
                <Field
                  component={TimeInputField}
                  disabled={disabled}
                  name={`${ADD_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.END_TIME}`}
                  label={t(`event.form.labelEndTime`)}
                  placeholder={t('common.placeholderTime')}
                  required={true}
                />
              </SplittedRow>
            </FormGroup>
            <Button
              disabled={disabled || !isValid}
              fullWidth={true}
              iconLeft={<IconPlus />}
              onClick={() => handleSubmit()}
              type="button"
            >
              {t(`event.form.buttonAddEventTime.${eventType}`)}
            </Button>
          </>
        );
      }}
    </Formik>
  );
};

export default AddEventTimeForm;
