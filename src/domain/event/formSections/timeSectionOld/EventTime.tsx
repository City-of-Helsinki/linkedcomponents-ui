import { FastField, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DeleteButton from '../../../../common/components/deleteButton/DeleteButton';
import DatepickerField from '../../../../common/components/formFields/DatepickerField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import {
  EventFieldsFragment,
  SuperEventType,
} from '../../../../generated/graphql';
import { EVENT_FIELDS } from '../../constants';
import FieldWithButton from '../../layout/FieldWithButton';

export type EventTimeProps = {
  eventTimePath: string;
  onDelete?: () => void;
  savedEvent?: EventFieldsFragment;
};

const getFieldName = (eventTimePath: string, field: string) =>
  eventTimePath ? `${eventTimePath}.${field}` : field;

const EventTime: React.FC<EventTimeProps> = ({
  eventTimePath,
  onDelete,
  savedEvent,
}) => {
  const [{ value: type }] = useField({
    name: EVENT_FIELDS.TYPE,
  });

  const isRecurringEvent =
    savedEvent?.superEventType === SuperEventType.Recurring;
  const { t } = useTranslation();

  return (
    <FieldWithButton
      button={
        onDelete && (
          <DeleteButton
            ariaLabel={t('event.form.buttonDeleteEventTime')}
            onClick={onDelete}
          />
        )
      }
    >
      <>
        <FormGroup>
          <FastField
            // Use type as key for the component to force rerender when event type changes
            key={type}
            component={DatepickerField}
            disabled={isRecurringEvent}
            name={getFieldName(eventTimePath, EVENT_FIELDS.START_TIME)}
            label={t(`event.form.labelStartTime.${type}`)}
            placeholder={t('common.placeholderDateTime')}
            required={true}
            timeSelector={true}
          />
        </FormGroup>
        <FormGroup>
          <FastField
            // Use type as key for the component to force rerender when event type changes
            key={type}
            component={DatepickerField}
            disabled={isRecurringEvent}
            name={getFieldName(eventTimePath, EVENT_FIELDS.END_TIME)}
            label={t(`event.form.labelEndTime.${type}`)}
            placeholder={t('common.placeholderDateTime')}
            required={true}
            timeSelector={true}
          />
        </FormGroup>
      </>
    </FieldWithButton>
  );
};

export default EventTime;
