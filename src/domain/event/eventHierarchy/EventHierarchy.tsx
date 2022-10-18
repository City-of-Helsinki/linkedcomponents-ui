import xor from 'lodash/xor';
import React from 'react';

import { EventFieldsFragment } from '../../../generated/graphql';
import styles from './eventHierarchy.module.scss';
import EventHierarchyRow from './eventHierarchyRow/EventHierarchyRow';
import SubEvents from './subEvents/SubEvents';

interface Props {
  eventNameRenderer?: (event: EventFieldsFragment) => React.ReactElement;
  event: EventFieldsFragment;
  showSuperEvent?: boolean;
}

const EventHierarchy: React.FC<Props> = ({
  event,
  eventNameRenderer,
  showSuperEvent,
}) => {
  const [closedIds, setClosedIds] = React.useState<string[]>([]);
  const superEvent = event.superEvent;
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
          eventNameRenderer={eventNameRenderer}
          level={0}
          open={superEventOpen}
          showToggleButton={true}
          toggle={toggle}
        />
      )}
      {(!showSuperEvent || superEventOpen) && (
        <SubEvents
          closedIds={closedIds}
          event={event}
          eventNameRenderer={eventNameRenderer}
          level={isSuperEventVisible ? 1 : 0}
          toggle={toggle}
        />
      )}
    </div>
  );
};

export default EventHierarchy;
