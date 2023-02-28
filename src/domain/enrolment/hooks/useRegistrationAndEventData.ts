import { ApolloQueryResult, QueryOptions } from '@apollo/client';
import { useParams } from 'react-router';

import {
  EventFieldsFragment,
  RegistrationFieldsFragment,
  RegistrationQuery,
  RegistrationQueryVariables,
  useEventQuery,
  useRegistrationQuery,
} from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import { EVENT_INCLUDES } from '../../event/constants';
import { eventPathBuilder } from '../../event/utils';
import { REGISTRATION_INCLUDES } from '../../registration/constants';
import { registrationPathBuilder } from '../../registration/utils';
import useUser from '../../user/hooks/useUser';

type UseRegistrationAndEventDataProps = {
  overrideEventQueryOptions?: Omit<QueryOptions, 'query' | 'variables'>;
  registrationId?: string;
  shouldFetchEvent?: boolean;
};

type UseRegistrationAndEventDataState = {
  event: EventFieldsFragment | undefined;
  loading: boolean;

  refetchRegistration: (
    variables?: Partial<RegistrationQueryVariables>
  ) => Promise<ApolloQueryResult<RegistrationQuery>>;
  registration: RegistrationFieldsFragment | undefined;
};

const useRegistrationAndEventData = ({
  overrideEventQueryOptions,
  registrationId: _registrationId,
  shouldFetchEvent,
}: UseRegistrationAndEventDataProps): UseRegistrationAndEventDataState => {
  const { registrationId: registrationIdParam } = useParams<{
    registrationId: string;
  }>();
  const registrationId = _registrationId || registrationIdParam;
  const { loading: loadingUser, user } = useUser();

  const {
    data: registrationData,
    loading: loadingRegistration,
    refetch: refetchRegistration,
  } = useRegistrationQuery({
    skip: !registrationId || !user,
    fetchPolicy: 'network-only',
    variables: {
      id: getValue(registrationId, ''),
      createPath: getPathBuilder(registrationPathBuilder),
      include: REGISTRATION_INCLUDES,
    },
  });

  const registration = registrationData?.registration;

  const { data: eventData, loading: loadingEvent } = useEventQuery({
    ...(overrideEventQueryOptions
      ? overrideEventQueryOptions
      : {
          fetchPolicy: 'no-cache',
          notifyOnNetworkStatusChange: true,
        }),
    skip: !shouldFetchEvent || loadingUser || !registration?.event,
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id: getValue(registration?.event, ''),
      include: EVENT_INCLUDES,
    },
  });

  return {
    event: eventData?.event,
    loading: loadingUser || loadingRegistration || loadingEvent,
    refetchRegistration,
    registration: registration,
  };
};

export default useRegistrationAndEventData;
