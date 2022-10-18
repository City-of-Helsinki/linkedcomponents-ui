import { IconCrossCircle, IconMenuDots, IconPen } from 'hds-react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import MenuDropdown from '../../../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../../../common/components/menuDropdown/types';
import Table from '../../../../../common/components/table/Table';
import { DATETIME_FORMAT } from '../../../../../constants';
import {
  EventFieldsFragment,
  SuperEventType,
} from '../../../../../generated/graphql';
import useIdWithPrefix from '../../../../../hooks/useIdWithPrefix';
import formatDate from '../../../../../utils/formatDate';
import { useAuth } from '../../../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../../../organization/hooks/useOrganizationAncestors';
import useUser from '../../../../user/hooks/useUser';
import { EVENT_EDIT_ACTIONS } from '../../../constants';
import { EventTime } from '../../../types';
import { getEditButtonProps } from '../../../utils';
import EditEventTimeModal from '../editEventTimeModal/EditEventTimeModal';
import styles from '../timeSection.module.scss';
import TimeSectionContext from '../TimeSectionContext';
import { getEventEditAction, sortEventTimes } from '../utils';

interface EventTimeRowProps {
  eventTime: EventTime;
  index: number;
  onDelete: (index: number) => void;
  onUpdate: (index: number, values: EventTime) => void;
  startIndex: number;
}

/* istanbul ignore next */
const formatDateStr = (date?: Date | null) =>
  (date && formatDate(new Date(date), DATETIME_FORMAT)) ?? '';

const EventTimeRow: React.FC<EventTimeRowProps> = ({
  eventTime,
  index,
  onDelete,
  onUpdate,
  startIndex,
}) => {
  const { t } = useTranslation();
  const { isEditingAllowed, savedEvent } = useContext(TimeSectionContext);
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  // Get the event by event time id. This variable is used to check
  // update/delete permissions
  const event = [
    ...((savedEvent?.subEvents ?? []) as EventFieldsFragment[]),
    savedEvent,
  ].find((subEvent) => subEvent?.id === eventTime.id);

  const { organizationAncestors } = useOrganizationAncestors(
    event?.publisher as string
  );

  const { endTime, startTime } = eventTime;

  const dateText =
    startTime || endTime
      ? `${formatDateStr(startTime)} – ${formatDateStr(endTime)}`
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

    if (event) {
      const options = getEditButtonProps({
        action: getEventEditAction({ action, event }),
        authenticated,
        event,
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

  const menuDropdownId = useIdWithPrefix({ prefix: 'menu-dropdown-' });
  const buttonId = `${menuDropdownId}-button`;

  return (
    <>
      {isEditModalOpen && (
        <EditEventTimeModal
          eventTime={eventTime}
          focusAfterCloseElement={
            document.getElementById(buttonId) ||
            /* istanbul ignore next */ undefined
          }
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
              <button
                className={styles.toggleButton}
                disabled={!isEditingAllowed}
              >
                <IconMenuDots aria-hidden={true} />
              </button>
            }
            buttonLabel={t('common.buttonActions')}
            className={styles.toggleButton}
            closeOnItemClick={true}
            fixedPosition={true}
            id={menuDropdownId}
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
