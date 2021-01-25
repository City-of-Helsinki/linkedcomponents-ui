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
}

const EventHierarchy: React.FC<Props> = ({ event }) => {
  const locale = useLocale();
  const [closedIds, setClosedIds] = React.useState<string[]>([]);
  const { id, name, startTime, subEventAtIds, superEventType } = getEventFields(
    event,
    locale
  );
  const open = !closedIds.includes(id);

  const subEvents = (event.subEvents as EventFieldsFragment[]) || [];

  const toggle = (eventId: string) => {
    setClosedIds(xor(closedIds, [eventId]));
  };

  return (
    <div className={styles.eventHierarchy}>
      <EventHierarchyRow
        id={id}
        level={0}
        name={name}
        open={open}
        startTime={startTime}
        superEventType={superEventType}
        toggle={!!subEventAtIds.length ? toggle : undefined}
      />

      {open &&
        subEvents.map((subEvent) => {
          return (
            subEvent && (
              <SubEvents
                key={subEvent.atId}
                closedIds={closedIds}
                event={subEvent}
                level={1}
                toggle={toggle}
              />
            )
          );
        })}
    </div>
  );
};

export default EventHierarchy;
