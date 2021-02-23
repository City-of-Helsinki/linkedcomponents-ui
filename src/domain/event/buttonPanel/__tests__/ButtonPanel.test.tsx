import { AnyAction, Store } from '@reduxjs/toolkit';
import { Formik } from 'formik';
import React from 'react';

import { defaultStoreState } from '../../../../constants';
import { StoreState } from '../../../../types';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import { getMockReduxStore, render, screen } from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
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
  const storeState = fakeAuthenticatedStoreState();
  const store = getMockReduxStore(storeState);

  renderComponent(store);

  const buttons = [
    translations.event.form.buttonSaveDraft,
    translations.event.form.buttonPublish.event,
  ];

  buttons.forEach((name) => {
    expect(screen.getByRole('button', { name })).toBeEnabled();
  });
});
