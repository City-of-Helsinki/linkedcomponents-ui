import React from 'react';

import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import EventList from '../events/eventList/EventList';
import SearchPanel from './searchPanel/SearchPanel';

const EventSearchPage: React.FC = () => {
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
        <EventList />
      </MainContent>
    </PageWrapper>
  );
};

export default EventSearchPage;
