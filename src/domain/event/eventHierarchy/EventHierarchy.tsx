import xor from 'lodash/xor';
import React from 'react';

import { EventFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { getEventFields } from '../utils';
import styles from './eventHierarchy.module.scss';
import EventHierarchyRow from './EventHierarchyRow';
import SubEvents from './SubEvents';

interface Props {
  event: EventFieldsFragment;
  showSuperEvent?: boolean;
}

const EventHierarchy: React.FC<Props> = ({ event, showSuperEvent }) => {
  const locale = useLocale();
  const [closedIds, setClosedIds] = React.useState<string[]>([]);
  const { id, subEventAtIds } = getEventFields(event, locale);
  const subEvents = event.subEvents as EventFieldsFragment[];
  const superEvent = event.superEvent;
  const open = !closedIds.includes(id);
  const superEventOpen = Boolean(
    !superEvent?.id || !closedIds.includes(superEvent?.id)
  );

  const toggle = (eventId: string) => {
    setClosedIds(xor(closedIds, [eventId]));
  };

  const isSuperEventVisible = Boolean(showSuperEvent && superEvent);

  return (
    <div className={styles.eventHierarchy}>
      {isSuperEventVisible && (
        <EventHierarchyRow
          disabled={true}
          event={superEvent as EventFieldsFragment}
          level={0}
          open={superEventOpen}
          showToggleButton={true}
          toggle={toggle}
        />
      )}
      {(!showSuperEvent || superEventOpen) && (
        <>
          <EventHierarchyRow
            level={isSuperEventVisible ? 1 : 0}
            event={event}
            open={open}
            showToggleButton={!!subEventAtIds.length}
            toggle={toggle}
          />

          {open &&
            subEvents.map((subEvent) => {
              return (
                subEvent && (
                  <SubEvents
                    key={subEvent.atId}
                    closedIds={closedIds}
                    event={subEvent}
                    level={isSuperEventVisible ? 2 : 1}
                    toggle={toggle}
                  />
                )
              );
            })}
        </>
      )}
    </div>
  );
};

export default EventHierarchy;
