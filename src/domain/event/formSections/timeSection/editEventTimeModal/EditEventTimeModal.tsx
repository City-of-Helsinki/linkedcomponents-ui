import { Field, Formik } from 'formik';
import { ButtonVariant, Dialog, IconInfoCircle, IconPen } from 'hds-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../../common/components/button/Button';
import DateInputField from '../../../../../common/components/formFields/dateInputField/DateInputField';
import TimeInputField from '../../../../../common/components/formFields/timeInputField/TimeInputField';
import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import { TIME_FORMAT_DATA } from '../../../../../constants';
import formatDate from '../../../../../utils/formatDate';
import getDateFromString from '../../../../../utils/getDateFromString';
import getDatePickerInitialMonth from '../../../../../utils/getDatePickerInitialMonth';
import setDateTime from '../../../../../utils/setDateTime';
import SplittedRow from '../../../../app/layout/splittedRow/SplittedRow';
import {
  EDIT_EVENT_TIME_FORM_NAME,
  EVENT_TIME_FIELDS,
} from '../../../constants';
import { EditEventTimeFormFields, EventTime } from '../../../types';
import { editEventTimeSchema } from '../../../validation';
import useTimeSectionContext from '../hooks/useTimeSectionContext';
import styles from '../timeSection.module.scss';

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

  const { eventType } = useTimeSectionContext();

  const { end, start } = useMemo(() => {
    return {
      end: getDateFromString(eventTime.endTime),
      start: getDateFromString(eventTime.startTime),
    };
  }, [eventTime]);

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
        iconStart={<IconInfoCircle aria-hidden={true} />}
        title={t('event.editEventTimeModal.title')}
      />
      <Formik
        initialValues={{
          [EDIT_EVENT_TIME_FORM_NAME]: {
            endDate: end,
            endTime: formatDate(end, TIME_FORMAT_DATA),
            startDate: start,
            startTime: formatDate(start, TIME_FORMAT_DATA),
          },
        }}
        onSubmit={submitEditEventTime}
        validateOnBlur={false}
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
                  <SplittedRow>
                    <Field
                      component={DateInputField}
                      label={t(`event.form.labelStartDate.${eventType}`)}
                      name={`${EDIT_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.START_DATE}`}
                      placeholder={t('common.placeholderDate')}
                      required={true}
                    />
                    <Field
                      component={TimeInputField}
                      label={t(`event.form.labelStartTime`)}
                      name={`${EDIT_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.START_TIME}`}
                      placeholder={t('common.placeholderTime')}
                      required={true}
                    />
                  </SplittedRow>
                </FormGroup>
                <FormGroup>
                  <SplittedRow>
                    <Field
                      component={DateInputField}
                      name={`${EDIT_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.END_DATE}`}
                      initialMonth={getDatePickerInitialMonth(startDate)}
                      label={t(`event.form.labelEndDate.${eventType}`)}
                      minDate={startDate}
                      placeholder={t('common.placeholderDate')}
                      required={true}
                    />
                    <Field
                      component={TimeInputField}
                      name={`${EDIT_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.END_TIME}`}
                      label={t(`event.form.labelEndTime`)}
                      placeholder={t('common.placeholderTime')}
                      required={true}
                    />
                  </SplittedRow>
                </FormGroup>
              </Dialog.Content>
              <Dialog.ActionButtons>
                <Button
                  onClick={() => handleSubmit()}
                  iconStart={<IconPen />}
                  type="button"
                  variant={ButtonVariant.Primary}
                >
                  {t('event.editEventTimeModal.buttonSave')}
                </Button>
                <Button
                  onClick={onCancel}
                  type="button"
                  variant={ButtonVariant.Secondary}
                >
                  {t('common.cancel')}
                </Button>
              </Dialog.ActionButtons>
            </>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default EditEventTimeModal;
