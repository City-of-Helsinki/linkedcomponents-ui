import { configureStore, Store } from '@reduxjs/toolkit';
import { loadUser } from 'redux-oidc';

import userManager from '../../auth/userManager';
import reducer from './reducers';

const store: Store = configureStore({
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  reducer,
});

loadUser(store, userManager);

export { store };
