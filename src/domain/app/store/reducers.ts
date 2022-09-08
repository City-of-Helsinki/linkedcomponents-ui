import { combineReducers } from '@reduxjs/toolkit';

import eventsReducers from '../../events/reducers';
import organizationsReducers from '../../organizations/reducers';

export default combineReducers({
  events: eventsReducers,
  organizations: organizationsReducers,
});
