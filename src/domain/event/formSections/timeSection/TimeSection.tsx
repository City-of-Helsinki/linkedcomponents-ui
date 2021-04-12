import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import TabPanel from '../../../../common/components/tabs/TabPanel';
import Tabs from '../../../../common/components/tabs/Tabs';
import pascalCase from '../../../../utils/pascalCase';
import { EVENT_FIELDS } from '../../constants';
import { EventTime, RecurringEventSettings } from '../../types';
import EventTimeTab from './EventTimeTab';
import RecurringEventTab from './RecurringEventTab';

enum EVENT_TIME_TAB {
  EVENT_TIME = 'EVENT_TIME',
  RECURRING_EVENT = 'RECURRING_EVENT',
}

const TimeSection = () => {
  const { t } = useTranslation();

  const [{ value: type }] = useField(EVENT_FIELDS.TYPE);
  const [{ value: eventTimes }, , { setValue: setEventTimes }] = useField<
    EventTime[]
  >(EVENT_FIELDS.EVENT_TIMES);

  const [
    { value: recurringEvents },
    ,
    { setValue: setRecurringEvents },
  ] = useField<RecurringEventSettings[]>(EVENT_FIELDS.RECURRING_EVENTS);

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
    <div>
      <Tabs
        name="event-time-tabs"
        onChange={(tab) => setActiveTab(tab as EVENT_TIME_TAB)}
        options={tabOptions}
        activeTab={activeTab}
      >
        <TabPanel isActive={activeTab === EVENT_TIME_TAB.EVENT_TIME}>
          <EventTimeTab
            eventTimes={eventTimes}
            eventType={type}
            recurringEvents={recurringEvents}
            setEventTimes={setEventTimes}
            setRecurringEvents={setRecurringEvents}
          />
        </TabPanel>
        <TabPanel isActive={activeTab === EVENT_TIME_TAB.EVENT_TIME}>
          <RecurringEventTab
            eventTimes={eventTimes}
            eventType={type}
            recurringEvents={recurringEvents}
            setEventTimes={setEventTimes}
            setRecurringEvents={setRecurringEvents}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TimeSection;
