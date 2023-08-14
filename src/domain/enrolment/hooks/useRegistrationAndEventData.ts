import { ApolloQueryResult, QueryOptions } from '@apollo/client';
import { useParams } from 'react-router';

import {
  EventFieldsFragment,
  RegistrationFieldsFragment,
  RegistrationQuery,
  RegistrationQueryVariables,
  RegistrationsQueryVariables,
  useRegistrationQuery,
} from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import { REGISTRATION_INCLUDES } from '../../registration/constants';
import { registrationPathBuilder } from '../../registration/utils';
import useUser from '../../user/hooks/useUser';

type UseRegistrationAndEventDataProps = {
  overrideEventQueryOptions?: Omit<QueryOptions, 'query' | 'variables'>;
  registrationId?: string;
  overrideRegistrationsVariables?: Partial<RegistrationsQueryVariables>;
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
  overrideRegistrationsVariables,
  registrationId: _registrationId,
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
      ...overrideRegistrationsVariables,
    },
  });

  const registration = registrationData?.registration;

  return {
    event: registration?.event ?? undefined,
    loading: loadingUser || loadingRegistration,
    refetchRegistration,
    registration: registration,
  };
};

export default useRegistrationAndEventData;
