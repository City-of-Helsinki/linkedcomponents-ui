import { EventsPageSettingsState } from '../events/types';
import { OrganizationsPageSettingsState } from '../organizations/types';

export type PageSettingsContextProps = {
  events: EventsPageSettingsState;
  organizations: OrganizationsPageSettingsState;
};
