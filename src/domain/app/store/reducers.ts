import { combineReducers } from '@reduxjs/toolkit';

import organizationsReducers from '../../organizations/reducers';

export default combineReducers({
  organizations: organizationsReducers,
});
