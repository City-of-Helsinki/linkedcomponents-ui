import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DeleteButton from '../../../../common/components/deleteButton/DeleteButton';
import DatepickerField from '../../../../common/components/formFields/DatepickerField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import { EVENT_FIELDS } from '../../constants';
import TimeSectionRow from './TimeSectionRow';

type Props = {
  eventTimePath: string;
  onDelete?: () => void;
  type: string;
};

const EventTime: React.FC<Props> = ({ eventTimePath, onDelete, type }) => {
  const { t } = useTranslation();

  return (
    <TimeSectionRow
      input={
        <>
          <FormGroup>
            <Field
              component={DatepickerField}
              name={`${eventTimePath}.${EVENT_FIELDS.START_TIME}`}
              label={t(`event.form.labelStartTime.${type}`)}
              placeholder={t('event.form.placeholderStartTime')}
              required={true}
              timeSelector={true}
            />
          </FormGroup>
          <FormGroup>
            <Field
              component={DatepickerField}
              name={`${eventTimePath}.${EVENT_FIELDS.END_TIME}`}
              label={t(`event.form.labelEndTime.${type}`)}
              placeholder={t('event.form.placeholderEndTime')}
              required={true}
              timeSelector={true}
            />
          </FormGroup>
        </>
      }
      button={
        onDelete ? (
          <DeleteButton
            label={t('event.form.buttonDeleteEventTime')}
            onClick={onDelete}
          />
        ) : undefined
      }
    />
  );
};

export default EventTime;
