import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import { loadUser } from 'redux-oidc';

import userManager from '../../auth/userManager';
import reducer from './reducers';

const store: Store = configureStore({
  devTools: true,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
  reducer,
});

loadUser(store, userManager);

export { store };
