import { Field, Formik } from 'formik';
import { Dialog, IconInfoCircle, IconPen } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../../common/components/button/Button';
import DatepickerField from '../../../../../common/components/formFields/DatepickerField';
import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import {
  EDIT_EVENT_TIME_FORM_NAME,
  EVENT_TIME_FIELDS,
} from '../../../constants';
import { EditEventTimeFormFields, EventTime } from '../../../types';
import { editEventTimeSchema } from '../../../utils';
import styles from '../timeSection.module.scss';
import TimeSectionContext from '../TimeSectionContext';
import { getMinBookingDate } from '../utils';

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
      ...eventTime,
      endTime: values[EDIT_EVENT_TIME_FORM_NAME].endTime,
      startTime: values[EDIT_EVENT_TIME_FORM_NAME].startTime,
    });
  };

  return (
    <Formik
      initialValues={{
        [EDIT_EVENT_TIME_FORM_NAME]: {
          endTime: eventTime.endTime,
          startTime: eventTime.startTime,
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
          [EDIT_EVENT_TIME_FORM_NAME]: { startTime },
        },
      }) => {
        return (
          <>
            <Dialog.Content>
              <FormGroup>
                <Field
                  component={DatepickerField}
                  label={t(`event.form.labelStartTime.${eventType}`)}
                  name={`${EDIT_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.START_TIME}`}
                  placeholder={t('common.placeholderDateTime')}
                  required={true}
                  timeSelector={true}
                />
              </FormGroup>
              <Field
                component={DatepickerField}
                focusedDate={getMinBookingDate(startTime)}
                label={t(`event.form.labelEndTime.${eventType}`)}
                minBookingDate={getMinBookingDate(startTime)}
                name={`${EDIT_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.END_TIME}`}
                placeholder={t('common.placeholderDateTime')}
                required={true}
                timeSelector={true}
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
