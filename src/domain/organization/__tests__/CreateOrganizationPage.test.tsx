import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { fakeAuthenticatedAuthContextValue } from '../../../utils/mockAuthContextValue';
import {
  act,
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import {
  mockedOrganizationClassesResponse,
  mockedOrganizationClassResponse,
  organizationClassName,
} from '../../organizationClass/__mocks__/organizationClass';
import {
  mockedOrganizationsResponse,
  organizations,
} from '../../organizations/__mocks__/organizationsPage';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  mockedCreateOrganizationResponse,
  mockedInvalidCreateOrganizationResponse,
  organizationValues,
} from '../__mocks__/createOrganizationPage';
import CreateOrganizationPage from '../CreateOrganizationPage';

configure({ defaultHidden: true });

const authContextValue = fakeAuthenticatedAuthContextValue();

const defaultMocks = [
  mockedOrganizationsResponse,
  mockedOrganizationClassResponse,
  mockedOrganizationClassesResponse,
  mockedUserResponse,
];

const renderComponent = (mocks: MockedResponse[] = []) =>
  render(<CreateOrganizationPage />, { authContextValue, mocks });

const getElement = (
  key:
    | 'classificationInput'
    | 'classificationToggleButton'
    | 'nameInput'
    | 'originIdInput'
    | 'parentInput'
    | 'parentToggleButton'
    | 'saveButton'
) => {
  switch (key) {
    case 'classificationInput':
      return screen.getByRole('combobox', { name: /luokittelu/i });
    case 'classificationToggleButton':
      return screen.getByRole('button', { name: /luokittelu: valikko/i });
    case 'nameInput':
      return screen.getByRole('textbox', { name: /nimi/i });
    case 'originIdInput':
      return screen.getByRole('textbox', { name: /lähdetunniste/i });
    case 'parentInput':
      return screen.getByRole('combobox', { name: /pääorganisaatio/i });
    case 'parentToggleButton':
      return screen.getByRole('button', { name: /pääorganisaatio: valikko/i });
    case 'saveButton':
      return screen.getByRole('button', { name: /tallenna/i });
  }
};

const fillClassificationField = async () => {
  const user = userEvent.setup();
  const classificationToggleButton = getElement('classificationToggleButton');
  await act(async () => await user.click(classificationToggleButton));

  const option = await screen.findByRole('option', {
    name: organizationClassName,
  });
  await act(async () => await user.click(option));
};

const fillParentField = async () => {
  const user = userEvent.setup();
  await act(async () => await user.click(getElement('parentToggleButton')));
  const organizationOption = await screen.findByRole('option', {
    name: organizations.data[0]?.name as string,
  });
  await act(async () => await user.click(organizationOption));
};

const fillInputValues = async () => {
  const user = userEvent.setup();
  await act(
    async () =>
      await user.type(getElement('originIdInput'), organizationValues.originId)
  );
  await act(
    async () =>
      await user.type(getElement('nameInput'), organizationValues.name)
  );
  await fillClassificationField();
  await fillParentField();
};

test('should focus to first validation error when trying to save new organization', async () => {
  const user = userEvent.setup();
  renderComponent(defaultMocks);

  await loadingSpinnerIsNotInDocument();

  const saveButton = getElement('saveButton');
  await act(async () => await user.click(saveButton));

  const originIdInput = getElement('originIdInput');
  await waitFor(() => expect(originIdInput).toHaveFocus());
  await act(
    async () => await user.type(originIdInput, organizationValues.originId)
  );
  await act(async () => await user.click(saveButton));

  const nameInput = getElement('nameInput');
  await act(async () => await user.click(saveButton));

  await waitFor(() => expect(nameInput).toHaveFocus());
  await act(
    async () =>
      await user.type(getElement('nameInput'), organizationValues.name)
  );
  await act(async () => await user.click(saveButton));

  const parentInput = getElement('parentInput');
  await waitFor(() => expect(parentInput).toHaveFocus());
});

test('should move to organizations page after creating new organization', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedCreateOrganizationResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  await act(async () => await user.click(getElement('saveButton')));

  await waitFor(
    () =>
      expect(history.location.pathname).toBe(
        `/fi/administration/organizations`
      ),
    { timeout: 10000 }
  );
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidCreateOrganizationResponse]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  const saveButton = getElement('saveButton');
  await act(async () => await user.click(saveButton));

  await screen.findByText(/lomakkeella on seuraavat virheet/i, undefined, {
    timeout: 10000,
  });
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});
