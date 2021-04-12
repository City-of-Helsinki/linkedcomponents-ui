import { IconCrossCircle, IconMenuDots, IconPen } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import MenuDropdown from '../../../../common/components/menuDropdown/MenuDropdown';
import Table from '../../../../common/components/table/Table';
import { DATETIME_FORMAT } from '../../../../constants';
import formatDate from '../../../../utils/formatDate';
import { EventTime } from '../../types';
import EditEventTimeModal from './EditEventTimeModal';
import styles from './timeSection.module.scss';
import { sortEventTimes } from './utils';

interface EventTimeRowProps {
  eventTime: EventTime;
  eventType: string;
  index: number;
  onDelete: (index: number) => void;
  onUpdate: (index: number, values: EventTime) => void;
  startIndex: number;
}

const EventTimeRow: React.FC<EventTimeRowProps> = ({
  eventTime,
  eventType,
  index,
  onDelete,
  onUpdate,
  startIndex,
}) => {
  const { t } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const { endTime, startTime } = eventTime;

  const dateText =
    startTime || endTime
      ? `${startTime && formatDate(new Date(startTime), DATETIME_FORMAT)} – ${
          endTime && formatDate(new Date(endTime), DATETIME_FORMAT)
        }`
      : '';

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleUpdate = (values: EventTime) => {
    onUpdate(index, values);
    closeEditModal();
  };

  const actionItems = [
    {
      disabled: false,
      icon: <IconPen />,
      label: t('common.edit'),
      onClick: openEditModal,
    },
    {
      disabled: false,
      icon: <IconCrossCircle />,
      label: t('common.delete'),
      onClick: () => onDelete(index),
    },
  ];

  return (
    <>
      <EditEventTimeModal
        eventTime={eventTime}
        eventType={eventType}
        isOpen={isEditModalOpen}
        onCancel={closeEditModal}
        onSave={handleUpdate}
      />
      <tr>
        <td>{startIndex + index}</td>
        <td>{dateText}</td>
        <td>
          <MenuDropdown
            button={
              <button className={styles.toggleButton}>
                <IconMenuDots aria-hidden={true} />
              </button>
            }
            buttonLabel={t('event.form.buttonActions')}
            className={styles.toggleButton}
            closeOnItemClick={true}
            fixedPosition={true}
            items={actionItems}
          />
        </td>
      </tr>
    </>
  );
};

export interface EventTimesTableProps {
  eventTimes: EventTime[];
  eventType: string;
  setEventTimes: (eventTimes: EventTime[]) => void;
  startIndex?: number;
}

const EventTimesTable: React.FC<EventTimesTableProps> = ({
  eventTimes,
  eventType,
  setEventTimes,
  startIndex = 1,
}) => {
  const { t } = useTranslation();

  const handleDelete = (index: number) => {
    setEventTimes(
      eventTimes.filter((eventTime, eventIndex) => eventIndex !== index)
    );
  };

  const handleUpdate = (index: number, values: EventTime) => {
    setEventTimes(
      eventTimes
        .map((eventTime, eventIndex) =>
          eventIndex !== index ? eventTime : values
        )
        .sort(sortEventTimes)
    );
  };

  if (!eventTimes?.length) {
    return null;
  }

  return (
    <Table className={styles.eventTimesTable}>
      <thead>
        <tr>
          <th className={styles.indexColumn}>#</th>
          <th>{t('event.form.labelTime')}</th>
          <th className={styles.buttonColumn}></th>
        </tr>
      </thead>
      <tbody>
        {eventTimes.map((eventTime, index) => {
          return (
            <EventTimeRow
              key={index}
              eventTime={eventTime}
              eventType={eventType}
              index={index}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              startIndex={startIndex}
            />
          );
        })}
      </tbody>
    </Table>
  );
};

export default EventTimesTable;
