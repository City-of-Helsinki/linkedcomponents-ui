import React from 'react';
import { useLocation } from 'react-router';

import PageWrapper from '../app/layout/PageWrapper';
import { DEFAULT_EVENT_SORT, EVENT_SORT_OPTIONS } from '../events/constants';
import EventList from './eventList/EventList';
import SearchPanel from './searchPanel/SearchPanel';
import { getEventsQueryVariables } from './utils';

const EventSearchPage = () => {
  const [sort, setSort] = React.useState<EVENT_SORT_OPTIONS>(
    DEFAULT_EVENT_SORT
  );
  const location = useLocation();
  const variables = getEventsQueryVariables(location.search);

  return (
    <PageWrapper
      description="eventSearchPage.pageDescription"
      keywords={[
        'keywords.search',
        'keywords.filter',
        'keywords.date',
        'keywords.place',
      ]}
      title="eventSearchPage.pageTitle"
    >
      <SearchPanel />
      <EventList baseVariables={variables} sort={sort} setSort={setSort} />
    </PageWrapper>
  );
};

export default EventSearchPage;
