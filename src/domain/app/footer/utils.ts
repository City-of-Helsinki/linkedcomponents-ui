import { ROUTES } from '../../../constants';
import { UserFieldsFragment } from '../../../generated/graphql';
import { areRegistrationRoutesAllowed } from '../../user/permissions';
import { NavigationGroup, NavigationGroupItem } from './types';

const getNavigationGroupItemsInstructions = (
  user?: UserFieldsFragment
): NavigationGroupItem[] => [
  {
    label: 'helpPage.sideNavigation.labelEventsInstructions',
    url: ROUTES.INSTRUCTIONS_EVENTS,
  },
  ...(areRegistrationRoutesAllowed(user)
    ? [
        {
          label: 'helpPage.sideNavigation.labelRegistrationInstructions',
          url: ROUTES.INSTRUCTIONS_REGISTRATION,
        },
      ]
    : []),
  {
    label: 'helpPage.sideNavigation.labelFaq',
    url: ROUTES.INSTRUCTIONS_FAQ,
  },
];

export const getNavigationGroupInstructions = (
  user?: UserFieldsFragment
): NavigationGroup => ({
  heading: 'helpPage.sideNavigation.labelInstructions',
  headingLink: ROUTES.INSTRUCTIONS,
  items: getNavigationGroupItemsInstructions(user),
});
