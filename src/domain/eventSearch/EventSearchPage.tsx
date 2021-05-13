import React from 'react';
import { useLocation } from 'react-router';

import MainContent from '../app/layout/MainContent';
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
      <MainContent>
        <SearchPanel />
        <EventList baseVariables={variables} />
      </MainContent>
    </PageWrapper>
  );
};

export default EventSearchPage;
