import { Field, Formik } from 'formik';
import { IconPen } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../common/components/button/Button';
import DatepickerField from '../../../../common/components/formFields/DatepickerField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import Modal from '../../../../common/components/modal/Modal';
import { EDIT_EVENT_TIME_FORM_NAME, EVENT_TIME_FIELDS } from '../../constants';
import { EditEventTimeFormFields, EventTime } from '../../types';
import { editEventTimeSchema } from '../../utils';
import styles from './timeSection.module.scss';
import TimeSectionContext from './TimeSectionContext';

export interface EditEventTimeModalProps {
  eventTime: EventTime;
  isOpen: boolean;
  onCancel: () => void;
  onSave: (eventTime: EventTime) => void;
}

const EditEventTimeModal: React.FC<EditEventTimeModalProps> = ({
  eventTime,
  isOpen,
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
    <Modal
      className={styles.editEventModal}
      isOpen={isOpen}
      onClose={onCancel}
      shouldCloseOnEsc={true}
      size="m"
      title={t('event.editEventTimeModal.title')}
      type="info"
    >
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
              <div>
                <FormGroup>
                  <Field
                    component={DatepickerField}
                    name={`${EDIT_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.START_TIME}`}
                    label={t(`event.form.labelStartTime.${eventType}`)}
                    placeholder={t('common.placeholderDateTime')}
                    required={true}
                    timeSelector={true}
                  />
                </FormGroup>
                <Field
                  component={DatepickerField}
                  name={`${EDIT_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.END_TIME}`}
                  focusedDate={startTime}
                  minBookingDate={startTime}
                  label={t(`event.form.labelEndTime.${eventType}`)}
                  placeholder={t('common.placeholderDateTime')}
                  required={true}
                  timeSelector={true}
                />
              </div>
              <div className={styles.buttonWrapper}>
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
              </div>
            </>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default EditEventTimeModal;
