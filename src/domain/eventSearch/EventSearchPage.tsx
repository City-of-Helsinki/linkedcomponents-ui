import React from 'react';
import { useLocation } from 'react-router';

import PageWrapper from '../app/layout/PageWrapper';
import EventList from './eventList/EventList';
import SearchPanel from './searchPanel/SearchPanel';
import { getEventsQueryVariables } from './utils';

const EventSearchPage = () => {
  const location = useLocation();
  const variables = getEventsQueryVariables(location.search);

  return (
    <PageWrapper title="eventSearchPage.pageTitle">
      <SearchPanel />
      <EventList baseVariables={variables} />
    </PageWrapper>
  );
};

export default EventSearchPage;
