import React from 'react';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import useUser from '../user/hooks/useUser';
import EventForm from './eventForm/EventForm';
import useEventFieldOptionsData from './hooks/useEventFieldOptionsData';

type CreateEventPageProps = {
  externalUser?: boolean;
};

const CreateEventPage: React.FC<CreateEventPageProps> = ({
  externalUser = true,
}) => {
  const { loading: loadingUser } = useUser();

  // Load options for inLanguage, audience and keywords checkboxes
  const { loading: loadingEventFieldOptions } = useEventFieldOptionsData();

  const loading = loadingEventFieldOptions || loadingUser;

  return (
    <LoadingSpinner isLoading={loading}>
      <EventForm externalUser={externalUser} />
    </LoadingSpinner>
  );
};

export default CreateEventPage;
