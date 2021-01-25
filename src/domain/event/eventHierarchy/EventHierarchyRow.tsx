import { IconAngleDown, IconAngleUp } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import formatDate from '../../../utils/formatDate';
import SuperEventTypeTag from '../tags/SuperEventTypeTag';
import styles from './eventHierarchy.module.scss';

const PADDING = 24;

interface Props {
  id: string;
  level: number;
  name: string;
  open?: boolean;
  startTime: Date | null;
  superEventType: string | null;
  toggle?: (id: string) => void;
}

const EventHierarchyRow: React.FC<Props> = ({
  id,
  level,
  name,
  open,
  startTime,
  superEventType,
  toggle,
}) => {
  const showToggleButton = Boolean(toggle);
  const { t } = useTranslation();

  const handleToggle = () => {
    if (toggle) {
      toggle(id);
    }
  };

  return (
    <div
      className={styles.eventHierarchyRow}
      style={{ paddingLeft: level * PADDING }}
    >
      {showToggleButton && (
        <button
          aria-label={t('event.subEvents')}
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
