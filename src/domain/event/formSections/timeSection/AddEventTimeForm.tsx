import { Field, Formik, FormikHelpers } from 'formik';
import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../common/components/button/Button';
import DatepickerField from '../../../../common/components/formFields/DatepickerField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import { SuperEventType } from '../../../../generated/graphql';
import { ADD_EVENT_TIME_FORM_NAME, EVENT_TIME_FIELDS } from '../../constants';
import { AddEventTimeFormFields, EventTime } from '../../types';
import { addEventTimeValidationSchema } from '../../utils';
import TimeSectionContext from './TimeSectionContext';

interface Props {
  addEventTime: (eventTime: EventTime) => void;
}

const AddEventTimeForm: React.FC<Props> = ({ addEventTime }) => {
  const { t } = useTranslation();
  const { eventType, savedEvent } = React.useContext(TimeSectionContext);
  const disabled =
    savedEvent && savedEvent.superEventType !== SuperEventType.Recurring;

  const submitAddEventTime = (
    values: AddEventTimeFormFields,
    formikHelpers: FormikHelpers<AddEventTimeFormFields>
  ) => {
    const { resetForm, validateForm } = formikHelpers;
    addEventTime({
      id: null,
      ...values[ADD_EVENT_TIME_FORM_NAME],
    });
    resetForm();
    validateForm();
  };

  return (
    <Formik
      initialValues={
        {
          [ADD_EVENT_TIME_FORM_NAME]: {
            endTime: null,
            startTime: null,
          },
        } as AddEventTimeFormFields
      }
      onSubmit={submitAddEventTime}
      validateOnBlur
      validateOnChange
      validateOnMount
      validationSchema={addEventTimeValidationSchema}
    >
      {({
        handleSubmit,
        isValid,
        values: {
          [ADD_EVENT_TIME_FORM_NAME]: { startTime },
        },
      }) => {
        return (
          <div>
            <FormGroup>
              <Field
                component={DatepickerField}
                disabled={disabled}
                name={`${ADD_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.START_TIME}`}
                label={t(`event.form.labelStartTime.${eventType}`)}
                placeholder={t('common.placeholderDateTime')}
                required={true}
                timeSelector={true}
              />
            </FormGroup>
            <FormGroup>
              <Field
                component={DatepickerField}
                disabled={disabled}
                focusedDate={startTime}
                minBookingDate={startTime}
                name={`${ADD_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.END_TIME}`}
                label={t(`event.form.labelEndTime.${eventType}`)}
                placeholder={t('common.placeholderDateTime')}
                required={true}
                timeSelector={true}
              />
            </FormGroup>
            <Button
              disabled={disabled || !isValid}
              fullWidth={true}
              iconLeft={<IconPlus />}
              onClick={() => handleSubmit()}
              type="button"
            >
              {t('event.form.buttonAddEventTime')}
            </Button>
          </div>
        );
      }}
    </Formik>
  );
};

export default AddEventTimeForm;
