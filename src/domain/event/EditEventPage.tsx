/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useParams } from 'react-router';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { useEventQuery } from '../../generated/graphql';
import getPathBuilder from '../../utils/getPathBuilder';
import getValue from '../../utils/getValue';
import NotFound from '../notFound/NotFound';
import useUser from '../user/hooks/useUser';
import { EVENT_INCLUDES } from './constants';
import EventForm from './eventForm/EventForm';
import useEventFieldOptionsData from './hooks/useEventFieldOptionsData';
import useEventWithEducationKeywordsData from './hooks/useEventWithEducationKeywordsData';
import { eventPathBuilder } from './utils';

const EditEventPageWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { loading: loadingUser } = useUser();

  const {
    data: eventData,
    loading: loadingEvent,
    refetch,
  } = useEventQuery({
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    skip: loadingUser,
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id: getValue(id, ''),
      include: EVENT_INCLUDES,
    },
  });

  // Load options for inLanguage, audience and keywords checkboxes
  const { loading: loadingEventFieldOptions } = useEventFieldOptionsData();
  const loading = loadingEvent || loadingEventFieldOptions || loadingUser;

  const event = useEventWithEducationKeywordsData(eventData);

  return (
    <LoadingSpinner isLoading={loading}>
      {event ? <EventForm event={event} refetch={refetch} /> : <NotFound />}
    </LoadingSpinner>
  );
};

export default EditEventPageWrapper;
