import { AnyAction, Store } from '@reduxjs/toolkit';
import { Formik } from 'formik';
import React from 'react';

import {
  mockedUserResponse,
  organizationId,
} from '../../__mocks__/createEventPage';
import { defaultStoreState } from '../../../../constants';
import { EventType } from '../../../../generated/graphql';
import { StoreState } from '../../../../types';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import { getMockReduxStore, render, screen } from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import { EVENT_FIELDS } from '../../constants';
import ButtonPanel from '../ButtonPanel';

const mocks = [mockedUserResponse];

const renderComponent = (store?: Store<StoreState, AnyAction>) =>
  render(
    <Formik
      initialValues={{ [EVENT_FIELDS.TYPE]: EventType.General }}
      onSubmit={jest.fn()}
    >
      <ButtonPanel onSaveDraft={jest.fn()} publisher={organizationId} />
    </Formik>,
    { mocks, store }
  );

test('publish should be disabled when user is not authenticated', () => {
  const store = getMockReduxStore(defaultStoreState);

  renderComponent(store);

  const buttons = [translations.event.form.buttonPanel.warningNotAuthenticated];

  buttons.forEach((name) => {
    expect(screen.getByRole('button', { name })).toBeDisabled();
  });
});

test('buttons should be enabled when user is authenticated', async () => {
  const storeState = fakeAuthenticatedStoreState();
  const store = getMockReduxStore(storeState);

  renderComponent(store);

  const buttons = [
    translations.event.form.buttonSaveDraft,
    translations.event.form.buttonPublish.general,
  ];

  for (const name of buttons) {
    const button = await screen.findByRole('button', { name });
    expect(button).toBeEnabled();
  }
});
