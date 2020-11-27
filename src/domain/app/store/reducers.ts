import { combineReducers } from '@reduxjs/toolkit';

import authenticationReducers from '../../auth/reducers';

export default combineReducers({
  authentication: authenticationReducers,
});
