import { IconCrossCircle, IconMenuDots, IconPen } from 'hds-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import MenuDropdown from '../../../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../../../common/components/menuDropdown/types';
import CustomTable from '../../../../../common/components/table/CustomTable';
import HeaderRow from '../../../../../common/components/table/headerRow/HeaderRow';
import TableBody from '../../../../../common/components/table/tableBody/TableBody';
import { DATETIME_FORMAT } from '../../../../../constants';
import {
  EventFieldsFragment,
  SuperEventType,
} from '../../../../../generated/graphql';
import useIdWithPrefix from '../../../../../hooks/useIdWithPrefix';
import formatDate from '../../../../../utils/formatDate';
import getDateFromString from '../../../../../utils/getDateFromString';
import getValue from '../../../../../utils/getValue';
import skipFalsyType from '../../../../../utils/skipFalsyType';
import { useAuth } from '../../../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../../../organization/hooks/useOrganizationAncestors';
import useUser from '../../../../user/hooks/useUser';
import { EVENT_ACTIONS } from '../../../constants';
import { EventTime } from '../../../types';
import { getEventButtonProps } from '../../../utils';
import EditEventTimeModal from '../editEventTimeModal/EditEventTimeModal';
import useTimeSectionContext from '../hooks/useTimeSectionContext';
import styles from '../timeSection.module.scss';
import { getEventEditAction, sortEventTimes } from '../utils';

interface EventTimeRowProps {
  eventTime: EventTime;
  index: number;
  onDelete: (index: number) => void;
  onUpdate: (index: number, values: EventTime) => void;
  startIndex: number;
}

const formatDateStr = (date: Date | null) => formatDate(date, DATETIME_FORMAT);

const EventTimeRow: React.FC<EventTimeRowProps> = ({
  eventTime,
  index,
  onDelete,
  onUpdate,
  startIndex,
}) => {
  const { t } = useTranslation();
  const { isEditingAllowed, savedEvent } = useTimeSectionContext();
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  // Get the event by event time id. This variable is used to check
  // update/delete permissions
  const event = [
    ...(getValue(savedEvent?.subEvents, []).filter(
      skipFalsyType
    ) as EventFieldsFragment[]),
    savedEvent,
  ].find((subEvent) => subEvent?.id === eventTime.id);

  const { organizationAncestors } = useOrganizationAncestors(
    getValue(event?.publisher, '')
  );

  const { endTime, startTime } = useMemo(() => {
    return {
      endTime: getDateFromString(eventTime?.endTime),
      startTime: getDateFromString(eventTime?.startTime),
    };
  }, [eventTime]);

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
      const options = getEventButtonProps({
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
          (action === EVENT_ACTIONS.DELETE &&
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
        <td className={styles.indexColumn}>{startIndex + index}</td>
        <td>{dateText}</td>
        <td className={styles.buttonColumn}>
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
    <CustomTable className={styles.eventTimesTable} variant="light">
      <thead>
        <HeaderRow>
          <th className={styles.indexColumn}>#</th>
          <th>{t('event.form.labelTime')}</th>
          <th className={styles.buttonColumn}></th>
        </HeaderRow>
      </thead>
      <TableBody>
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
      </TableBody>
    </CustomTable>
  );
};

export default EventTimesTable;
