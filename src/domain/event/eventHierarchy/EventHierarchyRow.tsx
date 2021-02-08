import { IconAngleDown, IconAngleUp } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import formatDate from '../../../utils/formatDate';
import SuperEventTypeTag from '../tags/SuperEventTypeTag';
import styles from './eventHierarchy.module.scss';

export const PADDING = 24;

interface Props {
  id: string;
  level: number;
  name: string;
  open?: boolean;
  showToggleButton: boolean;
  startTime: Date | null;
  superEventType: string | null;
  toggle: (id: string) => void;
}

const EventHierarchyRow: React.FC<Props> = ({
  id,
  level,
  name,
  open,
  showToggleButton,
  startTime,
  superEventType,
  toggle,
}) => {
  const { t } = useTranslation();

  const handleToggle = () => {
    toggle(id);
  };

  return (
    <div
      className={styles.eventHierarchyRow}
      style={{ paddingLeft: level * PADDING }}
    >
      {showToggleButton && (
        <button
          aria-label={
            open
              ? t('eventsPage.eventsTable.hideSubEvents', { name })
              : t('eventsPage.eventsTable.showSubEvents', { name })
          }
          onClick={handleToggle}
          type="button"
        >
          {open ? (
            <IconAngleUp aria-hidden={true} size="s" />
          ) : (
            <IconAngleDown aria-hidden={true} size="s" />
          )}
        </button>
      )}
      <SuperEventTypeTag superEventType={superEventType} />
      <span className={styles.name}>{name}</span>
      {startTime && <span>({formatDate(startTime)})</span>}
    </div>
  );
};

export default EventHierarchyRow;
