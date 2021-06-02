import { IconCrossCircle, IconMenuDots, IconPen } from 'hds-react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import MenuDropdown from '../../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../../common/components/menuDropdown/MenuItem';
import Table from '../../../../common/components/table/Table';
import { DATETIME_FORMAT } from '../../../../constants';
import {
  EventFieldsFragment,
  SuperEventType,
} from '../../../../generated/graphql';
import formatDate from '../../../../utils/formatDate';
import { authenticatedSelector } from '../../../auth/selectors';
import useUser from '../../../user/hooks/useUser';
import { EVENT_EDIT_ACTIONS } from '../../constants';
import useEventOrganizationAncestors from '../../hooks/useEventOrganizationAncestors';
import { EventTime } from '../../types';
import { getEditButtonProps } from '../../utils';
import EditEventTimeModal from './EditEventTimeModal';
import styles from './timeSection.module.scss';
import TimeSectionContext from './TimeSectionContext';
import { getEventEditAction, sortEventTimes } from './utils';

interface EventTimeRowProps {
  eventTime: EventTime;
  index: number;
  onDelete: (index: number) => void;
  onUpdate: (index: number, values: EventTime) => void;
  startIndex: number;
}

const EventTimeRow: React.FC<EventTimeRowProps> = ({
  eventTime,
  index,
  onDelete,
  onUpdate,
  startIndex,
}) => {
  const { t } = useTranslation();
  const { savedEvent } = useContext(TimeSectionContext);
  const authenticated = useSelector(authenticatedSelector);
  const { user } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const savedSubEvent = savedEvent?.subEvents.find(
    (subEvent) => subEvent?.id === eventTime.id
  ) as EventFieldsFragment;

  const { organizationAncestors } =
    useEventOrganizationAncestors(savedSubEvent);

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

  const getActionItemProps = ({
    action,
    onClick,
  }: {
    action: 'delete' | 'update';
    onClick: () => void;
  }): MenuItemOptionProps => {
    const icons = {
      delete: <IconCrossCircle aria-hidden={true} />,
      update: <IconPen aria-hidden={true} />,
    };
    const labels = {
      delete: t('common.delete'),
      update: t('common.edit'),
    };

    const baseOptions: MenuItemOptionProps = {
      disabled: Boolean(eventTime.id),
      icon: icons[action],
      label: labels[action],
      onClick,
    };

    if (savedSubEvent) {
      const options = getEditButtonProps({
        action: getEventEditAction({ action, event: savedSubEvent }),
        authenticated,
        event: savedSubEvent,
        onClick,
        organizationAncestors,
        t,
        user,
      });
      return {
        ...baseOptions,
        disabled:
          (action === EVENT_EDIT_ACTIONS.DELETE &&
            savedEvent &&
            savedEvent.superEventType !== SuperEventType.Recurring) ||
          options?.disabled,
        title: options?.title,
      };
    } else {
      return baseOptions;
    }
  };

  const actionItems = [
    getActionItemProps({
      action: 'update',
      onClick: openEditModal,
    }),
    getActionItemProps({
      action: 'delete',
      onClick: () => onDelete(index),
    }),
  ];

  return (
    <>
      {isEditModalOpen && (
        <EditEventTimeModal
          eventTime={eventTime}
          isOpen={isEditModalOpen}
          onCancel={closeEditModal}
          onSave={handleUpdate}
        />
      )}

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
  setEventTimes: (eventTimes: EventTime[]) => void;
  startIndex?: number;
}

const EventTimesTable: React.FC<EventTimesTableProps> = ({
  eventTimes,
  setEventTimes,
  startIndex = 1,
}) => {
  const { t } = useTranslation();

  const handleDelete = (index: number) => {
    setEventTimes(eventTimes.filter((_, eventIndex) => eventIndex !== index));
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
