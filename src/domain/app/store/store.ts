import { configureStore, Store } from '@reduxjs/toolkit';
import { loadUser } from 'redux-oidc';

import userManager from '../../auth/userManager';
import reducer from './reducers';

const store: Store = configureStore({
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['redux-oidc/USER_FOUND'],
        // Ignore these paths in the state
        ignoredPaths: ['authentication.oidc.user'],
      },
    }),
  reducer,
});

loadUser(store, userManager);

export { store };
