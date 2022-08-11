import { Field, Formik } from 'formik';
import { Dialog, IconInfoCircle, IconPen } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../../common/components/button/Button';
import DateInputField from '../../../../../common/components/formFields/dateInputField/DateInputField';
import TimeInputField from '../../../../../common/components/formFields/timeInputField/TimeInputField';
import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import { TIME_FORMAT_DATA } from '../../../../../constants';
import formatDate from '../../../../../utils/formatDate';
import setDateTime from '../../../../../utils/setDateTime';
import {
  EDIT_EVENT_TIME_FORM_NAME,
  EVENT_TIME_FIELDS,
} from '../../../constants';
import { EditEventTimeFormFields, EventTime } from '../../../types';
import { editEventTimeSchema } from '../../../validation';
import styles from '../timeSection.module.scss';
import TimeSectionContext from '../TimeSectionContext';

export interface ModalContentProps {
  eventTime: EventTime;
  onCancel: () => void;
  onSave: (eventTime: EventTime) => void;
}

const ModalContent: React.FC<ModalContentProps> = ({
  eventTime,
  onCancel,
  onSave,
}) => {
  const { t } = useTranslation();
  const { eventType } = React.useContext(TimeSectionContext);

  const submitEditEventTime = (values: EditEventTimeFormFields) => {
    onSave({
      id: eventTime.id,
      endTime: setDateTime(
        values[EDIT_EVENT_TIME_FORM_NAME].endDate as Date,
        values[EDIT_EVENT_TIME_FORM_NAME].endTime
      ),
      startTime: setDateTime(
        values[EDIT_EVENT_TIME_FORM_NAME].startDate as Date,
        values[EDIT_EVENT_TIME_FORM_NAME].startTime
      ),
    });
  };

  return (
    <Formik
      initialValues={{
        [EDIT_EVENT_TIME_FORM_NAME]: {
          endDate: eventTime.endTime,
          endTime: formatDate(eventTime.endTime, TIME_FORMAT_DATA),
          startDate: eventTime.startTime,
          startTime: formatDate(eventTime.startTime, TIME_FORMAT_DATA),
        },
      }}
      onSubmit={submitEditEventTime}
      validateOnBlur
      validateOnChange
      validateOnMount
      validationSchema={editEventTimeSchema}
    >
      {({
        handleSubmit,
        values: {
          [EDIT_EVENT_TIME_FORM_NAME]: { startDate },
        },
      }) => {
        return (
          <>
            <Dialog.Content>
              <FormGroup>
                <Field
                  component={DateInputField}
                  label={t(`event.form.labelStartDate.${eventType}`)}
                  name={`${EDIT_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.START_DATE}`}
                  placeholder={t('common.placeholderDate')}
                  required={true}
                />
              </FormGroup>
              <FormGroup>
                <Field
                  component={TimeInputField}
                  label={t(`event.form.labelStartTime.${eventType}`)}
                  name={`${EDIT_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.START_TIME}`}
                  placeholder={t('common.placeholderTime')}
                  required={true}
                />
              </FormGroup>
              <FormGroup>
                <Field
                  component={DateInputField}
                  name={`${EDIT_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.END_DATE}`}
                  label={t(`event.form.labelEndDate.${eventType}`)}
                  minDate={startDate}
                  placeholder={t('common.placeholderDate')}
                  required={true}
                />
              </FormGroup>
              <Field
                component={TimeInputField}
                name={`${EDIT_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.END_TIME}`}
                label={t(`event.form.labelEndTime.${eventType}`)}
                placeholder={t('common.placeholderTime')}
                required={true}
              />
            </Dialog.Content>
            <Dialog.ActionButtons>
              <Button
                onClick={() => handleSubmit()}
                iconLeft={<IconPen />}
                type="button"
                variant="primary"
              >
                {t('event.editEventTimeModal.buttonSave')}
              </Button>
              <Button onClick={onCancel} type="button" variant="secondary">
                {t('common.cancel')}
              </Button>
            </Dialog.ActionButtons>
          </>
        );
      }}
    </Formik>
  );
};

export interface EditEventTimeModalProps {
  eventTime: EventTime;
  focusAfterCloseElement?: HTMLElement;
  isOpen: boolean;
  onCancel: () => void;
  onSave: (eventTime: EventTime) => void;
}

const EditEventTimeModal: React.FC<EditEventTimeModalProps> = ({
  eventTime,
  focusAfterCloseElement,
  isOpen,
  onCancel,
  onSave,
}) => {
  const { t } = useTranslation();

  const id = 'edit-event-time-modal';
  const titleId = `${id}-title`;

  return (
    <Dialog
      id={id}
      aria-labelledby={titleId}
      className={styles.editEventTimeModal}
      focusAfterCloseElement={focusAfterCloseElement}
      isOpen={isOpen}
      variant="primary"
    >
      <Dialog.Header
        id={titleId}
        iconLeft={<IconInfoCircle aria-hidden={true} />}
        title={t('event.editEventTimeModal.title')}
      />
      <ModalContent eventTime={eventTime} onCancel={onCancel} onSave={onSave} />
    </Dialog>
  );
};

export default EditEventTimeModal;
