import React from 'react';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import { useNocacheContext } from '../../../common/components/nocache/NocacheContext';
import { EventFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import isTestEnv from '../../../utils/isTestEnv';
import { EVENT_SORT_OPTIONS } from '../../events/constants';
import useSubEvents from '../../events/hooks/useSubEvents';
import { EVENT_INCLUDES } from '../constants';
import { getEventFields } from '../utils';
import styles from './eventHierarchy.module.scss';
import EventHierarchyRow from './EventHierarchyRow';

interface SubEventsProps {
  closedIds: string[];
  event: EventFieldsFragment;
  eventNameRenderer?: (event: EventFieldsFragment) => React.ReactElement;
  level: number;
  toggle: (id: string) => void;
}

const SubEvents: React.FC<SubEventsProps> = ({
  closedIds,
  event,
  eventNameRenderer,
  level,
  toggle,
}) => {
  const { nocache } = useNocacheContext();
  const locale = useLocale();
  const { id, subEventAtIds } = getEventFields(event, locale);
  const open = !closedIds.includes(id);

  const { subEvents, loading } = useSubEvents({
    nocache,
    skip: !subEventAtIds.length,
    superEventId: id,
    variableOverrides: {
      include: EVENT_INCLUDES,
      sort: EVENT_SORT_OPTIONS.START_TIME,
    },
  });

  return (
    <>
      <EventHierarchyRow
        event={event}
        eventNameRenderer={eventNameRenderer}
        level={level}
        open={open}
        showToggleButton={!!subEventAtIds.length}
        toggle={toggle}
      />

      {loading ? (
        <div style={{ paddingLeft: `calc(${level} * var(--spacing-m))` }}>
          {/* Timer of Loading spinner throws an error on jest tests after component unmount */}
          {!isTestEnv && (
            /* istanbul ignore next */
            <LoadingSpinner
              className={styles.loadingSpinner}
              isLoading={loading}
              small={true}
            />
          )}
        </div>
      ) : (
        <>
          {open &&
            subEvents.map(
              (subEvent) =>
                subEvent && (
                  <SubEvents
                    key={subEvent.atId}
                    closedIds={closedIds}
                    event={subEvent}
                    eventNameRenderer={eventNameRenderer}
                    level={level + 1}
                    toggle={toggle}
                  />
                )
            )}
        </>
      )}
    </>
  );
};

export default SubEvents;
