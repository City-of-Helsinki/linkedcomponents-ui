import { AnyAction, Store } from '@reduxjs/toolkit';
import { Formik } from 'formik';
import merge from 'lodash/merge';
import React from 'react';

import { defaultStoreState } from '../../../../constants';
import { StoreState } from '../../../../types';
import { getMockReduxStore, render, screen } from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import { API_CLIENT_ID } from '../../../auth/constants';
import { EVENT_FIELDS, EVENT_TYPE } from '../../constants';
import ButtonPanel from '../ButtonPanel';

const renderComponent = (store?: Store<StoreState, AnyAction>) =>
  render(
    <Formik
      initialValues={{ [EVENT_FIELDS.TYPE]: EVENT_TYPE.EVENT }}
      onSubmit={jest.fn()}
    >
      <ButtonPanel onSaveDraft={jest.fn()} />
    </Formik>,
    { store }
  );

test('buttons should be disabled when user is not authenticated', () => {
  const store = getMockReduxStore(defaultStoreState);

  renderComponent(store);

  const buttons = [
    translations.authentication.noRightsCreateEvent,
    translations.authentication.noRightsPublishEvent,
  ];

  buttons.forEach((name) => {
    expect(screen.getByRole('button', { name })).toBeDisabled();
  });
});

test('buttons should be enabled when user is authenticated', () => {
  const apiToken = { [API_CLIENT_ID]: 'api-token' };
  const user = { name: 'Test user' };
  const state = merge({}, defaultStoreState, {
    authentication: {
      oidc: { user },
      token: { apiToken },
    },
  });
  const store = getMockReduxStore(state);

  renderComponent(store);

  const buttons = [
    translations.event.form.buttonSaveDraft,
    translations.event.form.buttonPublish.event,
  ];

  buttons.forEach((name) => {
    expect(screen.getByRole('button', { name })).toBeEnabled();
  });
});
