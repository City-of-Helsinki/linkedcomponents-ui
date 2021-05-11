import {
  EventsQueryVariables,
  UserFieldsFragment,
} from '../../../generated/graphql';
import { getUserFields } from '../../user/utils';
import { EVENTS_PAGE_TABS } from '../constants';
import { getEventsQueryBaseVariables, getEventsQuerySkip } from '../utils';

interface EventsQueryVariablesState {
  skip: boolean;
  variables: EventsQueryVariables;
}

const useEventsQueryVariables = (
  tab: EVENTS_PAGE_TABS,
  user: UserFieldsFragment
): EventsQueryVariablesState => {
  const { adminOrganizations } = getUserFields(user);

  return {
    skip: getEventsQuerySkip(tab, adminOrganizations),
    variables: getEventsQueryBaseVariables({
      adminOrganizations,
      tab,
    }),
  };
};

export default useEventsQueryVariables;
