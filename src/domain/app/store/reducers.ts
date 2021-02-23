import { combineReducers } from '@reduxjs/toolkit';

import authenticationReducers from '../../auth/reducers';
import eventsReducers from '../../events/reducers';

export default combineReducers({
  authentication: authenticationReducers,
  events: eventsReducers,
});
