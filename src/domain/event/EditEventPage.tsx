/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useLocation, useParams } from 'react-router';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { useEventQuery } from '../../generated/graphql';
import getPathBuilder from '../../utils/getPathBuilder';
import NotFound from '../notFound/NotFound';
import useUser from '../user/hooks/useUser';
import { EVENT_INCLUDES } from './constants';
import EventForm from './eventForm/EventForm';
import useEventFieldOptionsData from './hooks/useEventFieldOptionsData';
import { eventPathBuilder } from './utils';

const EditEventPageWrapper: React.FC = () => {
  const location = useLocation();
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
      id: id as string,
      include: EVENT_INCLUDES,
    },
  });

  // Load options for inLanguage, audience and keywords checkboxes
  const { loading: loadingEventFieldOptions } = useEventFieldOptionsData();
  const loading = loadingEvent || loadingEventFieldOptions || loadingUser;

  return (
    <LoadingSpinner isLoading={loading}>
      {eventData?.event ? (
        <EventForm event={eventData?.event} refetch={refetch} />
      ) : (
        <NotFound pathAfterSignIn={`${location.pathname}${location.search}`} />
      )}
    </LoadingSpinner>
  );
};

export default EditEventPageWrapper;
