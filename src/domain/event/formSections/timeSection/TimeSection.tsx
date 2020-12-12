import { useField } from 'formik';
import { IconCalendarPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../common/components/button/Button';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import InputRow from '../../../../common/components/inputRow/InputRow';
import Modal from '../../../../common/components/modal/Modal';
import Notification from '../../../../common/components/notification/Notification';
import { INPUT_MAX_WIDTHS } from '../../../../constants';
import { EVENT_FIELDS } from '../../constants';
import styles from '../../eventPage.module.scss';
import { RecurringEventSettings } from '../../types';
import FieldArrayRow from '../FieldArrayRow';
import EventTime from './EventTime';
import EventTimes from './EventTimes';
import RecurringEvents from './RecurringEvents';
import RecurringEventsForm from './recurringEventsForm/RecurringEventsForm';

const TypeSection = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsmodalOpen] = React.useState(false);
  const [{ value: type }] = useField(EVENT_FIELDS.TYPE);
  const [
    { value: recurringEvents },
    ,
    { setValue: setRecurringEvents },
  ] = useField(EVENT_FIELDS.RECURRING_EVENTS);

  const openModal = () => {
    setIsmodalOpen(true);
  };

  const closeModal = () => {
    setIsmodalOpen(false);
  };

  const addRecurringEventSettings = (values: RecurringEventSettings) => {
    setRecurringEvents([...recurringEvents, values]);

    closeModal();
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        shouldCloseOnEsc={false}
        title={t(`event.form.modalTitleRecurringEvent`)}
      >
        <RecurringEventsForm onSubmit={addRecurringEventSettings} type={type} />
      </Modal>
      <h3>{t(`event.form.titleTime.${type}`)}</h3>

      <InputRow
        info={
          <Notification
            className={styles.notification}
            label={t(`event.form.notificationTitleEventTimes.${type}`)}
            type="info"
          >
            <p>{t(`event.form.infoTextEventTimes1.${type}`)}</p>
            <p>{t(`event.form.infoTextEventTimes2.${type}`)}</p>
            <p>{t(`event.form.infoTextEventTimes3.${type}`)}</p>
            <p>{t(`event.form.infoTextEventTimes4.${type}`)}</p>
            <p>{t(`event.form.infoTextEventTimes5.${type}`)}</p>
          </Notification>
        }
      >
        <EventTime eventTimePath="" type={type} />
        <FormGroup>
          <EventTimes />
        </FormGroup>

        <RecurringEvents />
        <FieldArrayRow
          input={
            <Button
              fullWidth={true}
              iconLeft={<IconCalendarPlus />}
              onClick={openModal}
              type="button"
              variant="supplementary"
            >
              {t(`event.form.buttonOpenRecurringEventSettings`)}
            </Button>
          }
          inputWidth={INPUT_MAX_WIDTHS.MEDIUM}
        />
      </InputRow>
    </>
  );
};

export default TypeSection;
