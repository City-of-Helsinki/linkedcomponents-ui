import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import TabPanel from '../../../../common/components/tabs/tabPanel/TabPanel';
import Tabs from '../../../../common/components/tabs/Tabs';
import { EventFieldsFragment } from '../../../../generated/graphql';
import pascalCase from '../../../../utils/pascalCase';
import { EVENT_FIELDS } from '../../constants';
import { EventTime, RecurringEventSettings } from '../../types';
import EventTimeTab from './eventTimeTab/EventTimeTab';
import RecurringEventTab from './recurringEventTab/RecurringEventTab';
import TimeSectionContext from './TimeSectionContext';

enum EVENT_TIME_TAB {
  EVENT_TIME = 'EVENT_TIME',
  RECURRING_EVENT = 'RECURRING_EVENT',
}

interface Props {
  isEditingAllowed: boolean;
  savedEvent?: EventFieldsFragment;
}

const TimeSection: React.FC<Props> = ({ isEditingAllowed, savedEvent }) => {
  const { t } = useTranslation();

  const [{ value: type }] = useField(EVENT_FIELDS.TYPE);
  const [{ value: eventTimes }, , { setValue: setEventTimes }] = useField<
    EventTime[]
  >(EVENT_FIELDS.EVENT_TIMES);
  const [{ value: events }, , { setValue: setEvents }] = useField<EventTime[]>(
    EVENT_FIELDS.EVENTS
  );

  const [{ value: recurringEvents }, , { setValue: setRecurringEvents }] =
    useField<RecurringEventSettings[]>(EVENT_FIELDS.RECURRING_EVENTS);

  const [activeTab, setActiveTab] = React.useState<EVENT_TIME_TAB>(
    EVENT_TIME_TAB.EVENT_TIME
  );
  const tabOptions = React.useMemo(
    () =>
      [EVENT_TIME_TAB.EVENT_TIME, EVENT_TIME_TAB.RECURRING_EVENT].map((tab) => {
        return {
          label: t(`event.form.tab${pascalCase(tab)}`),
          value: tab,
        };
      }),
    [t]
  );

  return (
    <TimeSectionContext.Provider
      value={{
        events,
        eventTimes,
        eventType: type,
        isEditingAllowed,
        recurringEvents,
        savedEvent,
        setEvents,
        setEventTimes,
        setRecurringEvents,
      }}
    >
      <div>
        <Tabs
          name="event-time-tabs"
          onChange={(tab) => setActiveTab(tab as EVENT_TIME_TAB)}
          options={tabOptions}
          activeTab={activeTab}
        >
          <TabPanel isActive={activeTab === EVENT_TIME_TAB.EVENT_TIME}>
            <EventTimeTab />
          </TabPanel>
          <TabPanel isActive={activeTab === EVENT_TIME_TAB.EVENT_TIME}>
            <RecurringEventTab />
          </TabPanel>
        </Tabs>
      </div>
    </TimeSectionContext.Provider>
  );
};

export default TimeSection;
