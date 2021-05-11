import React from 'react';
import { useLocation } from 'react-router';

import PageWrapper from '../app/layout/PageWrapper';
import EventList from './eventList/EventList';
import SearchPanel from './searchPanel/SearchPanel';
import { getEventsQueryVariables } from './utils';

const EventSearchPage: React.FC = () => {
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
      <EventList baseVariables={variables} />
    </PageWrapper>
  );
};

export default EventSearchPage;
