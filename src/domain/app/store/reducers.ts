import { combineReducers } from '@reduxjs/toolkit';

import authenticationReducers from '../../auth/reducers';
import eventsReducers from '../../events/reducers';
import organizationsReducers from '../../organizations/reducers';

export default combineReducers({
  authentication: authenticationReducers,
  events: eventsReducers,
  organizations: organizationsReducers,
});
