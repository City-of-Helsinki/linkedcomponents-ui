import { AnyAction, Store } from '@reduxjs/toolkit';
import { Formik } from 'formik';
import React from 'react';

import {
  mockedUserResponse,
  organizationId,
} from '../../__mocks__/createEventPage';
import { defaultStoreState } from '../../../../constants';
import { StoreState } from '../../../../types';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  configure,
  getMockReduxStore,
  render,
  screen,
} from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import { EVENT_FIELDS, EVENT_TYPE } from '../../constants';
import ButtonPanel from '../ButtonPanel';

configure({ defaultHidden: true });

const mocks = [mockedUserResponse];

const renderComponent = (store?: Store<StoreState, AnyAction>) =>
  render(
    <Formik
      initialValues={{ [EVENT_FIELDS.TYPE]: EVENT_TYPE.General }}
      onSubmit={jest.fn()}
    >
      <ButtonPanel
        onSaveDraft={jest.fn()}
        publisher={organizationId}
        saving={null}
      />
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

  const buttonSaveDraft = await screen.findByRole('button', {
    name: translations.event.form.buttonSaveDraft,
  });
  const buttonPublish = screen.getByRole('button', {
    name: translations.event.form.buttonPublish.general,
  });
  const buttons = [buttonSaveDraft, buttonPublish];

  for (const button of buttons) {
    expect(button).toBeEnabled();
  }
});
