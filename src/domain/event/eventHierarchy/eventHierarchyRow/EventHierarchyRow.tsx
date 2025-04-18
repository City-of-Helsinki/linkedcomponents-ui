import classNames from 'classnames';
import { IconAngleDown, IconAngleUp, IconSize } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { EventFieldsFragment } from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import formatDate from '../../../../utils/formatDate';
import getValue from '../../../../utils/getValue';
import useOrganizationAncestors from '../../../organization/hooks/useOrganizationAncestors';
import SuperEventTypeTag from '../../tags/superEventTypeTag/SuperEventTypeTag';
import { getEventFields } from '../../utils';
import styles from '../eventHierarchy.module.scss';

interface Props {
  disabled?: boolean;
  event: EventFieldsFragment;
  eventNameRenderer?: (event: EventFieldsFragment) => React.ReactElement;
  level: number;
  open?: boolean;
  showToggleButton: boolean;
  toggle: (id: string) => void;
}

const EventHierarchyRow: React.FC<Props> = ({
  disabled,
  event,
  eventNameRenderer,
  level,
  open,
  showToggleButton,
  toggle,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { id, name, startTime, superEventType } = getEventFields(event, locale);

  // Organization ancestors per sub-event are checked when saving recurring events,
  // so fetch organization ancestors for each sub-event to make saving more performant
  useOrganizationAncestors(getValue(event.publisher, ''));

  const handleToggle = () => {
    toggle(id);
  };

  return (
    <div
      className={classNames(styles.eventHierarchyRow, {
        [styles.disabled]: disabled,
      })}
      style={{ paddingLeft: `calc(${level} * var(--spacing-m))` }}
    >
      {showToggleButton && (
        <button
          aria-label={
            open
              ? getValue(
                  t('eventsPage.eventsTable.hideSubEvents', { name }),
                  undefined
                )
              : getValue(
                  t('eventsPage.eventsTable.showSubEvents', { name }),
                  undefined
                )
          }
          disabled={disabled}
          onClick={handleToggle}
          type="button"
        >
          {open ? (
            <IconAngleUp aria-hidden={true} size={IconSize.Small} />
          ) : (
            <IconAngleDown aria-hidden={true} size={IconSize.Small} />
          )}
        </button>
      )}
      <SuperEventTypeTag superEventType={superEventType} />
      <span className={styles.name}>
        {eventNameRenderer ? eventNameRenderer(event) : name}
      </span>
      {startTime && <span>({formatDate(startTime)})</span>}
    </div>
  );
};

export default EventHierarchyRow;
