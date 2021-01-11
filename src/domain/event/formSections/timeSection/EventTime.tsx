import { FastField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DeleteButton from '../../../../common/components/deleteButton/DeleteButton';
import DatepickerField from '../../../../common/components/formFields/DatepickerField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import { EVENT_FIELDS } from '../../constants';
import FieldWithButton from '../../layout/FieldWithButton';

type Props = {
  eventTimePath: string;
  onDelete?: () => void;
  type: string;
};

const getFieldName = (eventTimePath: string, field: string) =>
  eventTimePath ? `${eventTimePath}.${field}` : field;

const EventTime: React.FC<Props> = ({ eventTimePath, onDelete, type }) => {
  const { t } = useTranslation();

  return (
    <FieldWithButton
      button={
        onDelete && (
          <DeleteButton
            label={t('event.form.buttonDeleteEventTime')}
            onClick={onDelete}
          />
        )
      }
    >
      <>
        <FormGroup>
          <FastField
            component={DatepickerField}
            name={getFieldName(eventTimePath, EVENT_FIELDS.START_TIME)}
            label={t(`event.form.labelStartTime.${type}`)}
            placeholder={t('common.placeholderDateTime')}
            required={true}
            timeSelector={true}
          />
        </FormGroup>
        <FormGroup>
          <FastField
            component={DatepickerField}
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
