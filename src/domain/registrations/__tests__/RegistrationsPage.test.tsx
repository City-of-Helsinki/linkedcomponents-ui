/* eslint-disable max-len */
import { createMemoryHistory } from 'history';

import getValue from '../../../utils/getValue';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
  waitPageMetaDataToBeSet,
} from '../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  mockedRegistrationsResponse,
  registrations,
} from '../__mocks__/registrationsPage';
import RegistrationsPage from '../RegistrationsPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const mocks = [
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
  mockedRegistrationsResponse,
  mockedUserResponse,
];

const findElement = (key: 'createRegistrationButton') => {
  switch (key) {
    case 'createRegistrationButton':
      return screen.findByRole('button', { name: /lisää uusi/i });
  }
};

const getElement = (key: 'createRegistrationButton' | 'table') => {
  switch (key) {
    case 'createRegistrationButton':
      return screen.getByRole('button', { name: /lisää uusi/i });
    case 'table':
      return screen.getByRole('table', {
        name: /ilmoittautumiset, järjestys viimeksi muokattu, laskeva/i,
        hidden: true,
      });
  }
};

test('should show correct title, description and keywords', async () => {
  const pageTitle = 'Ilmoittautuminen - Linked Events';
  const pageDescription =
    'Ilmoittautumisten listaus. Selaa, suodata ja muokkaa ilmoittautumisiasi.';
  const pageKeywords =
    'ilmoittautuminen, lista, muokkaa, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi';

  render(<RegistrationsPage />, { mocks });

  await waitPageMetaDataToBeSet({ pageDescription, pageKeywords, pageTitle });
});

test('should render registrations page', async () => {
  render(<RegistrationsPage />, { mocks });

  await loadingSpinnerIsNotInDocument(10000);

  await findElement('createRegistrationButton');
  getElement('table');
});

test('should open create registration page', async () => {
  const user = userEvent.setup();
  const { history } = render(<RegistrationsPage />, {
    mocks,
  });

  await loadingSpinnerIsNotInDocument(10000);

  const createRegistrationButton = await findElement(
    'createRegistrationButton'
  );
  await user.click(createRegistrationButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/registrations/create')
  );
});

it('scrolls to registration table row and calls history.replace correctly (deletes registrationId from state)', async () => {
  const route = '/fi/registrations';
  const history = createMemoryHistory();
  history.push(route, { registrationId: registrations.data[0]?.id });

  const replaceSpy = vi.spyOn(history, 'replace');

  render(<RegistrationsPage />, {
    history,
    mocks,
    routes: [route],
  });

  await loadingSpinnerIsNotInDocument(10000);

  await waitFor(() =>
    expect(replaceSpy).toHaveBeenCalledWith(
      { hash: '', pathname: route, search: '' },
      {},
      { replace: true, state: {} }
    )
  );

  const registrationLink = await screen.findByRole(
    'link',
    { name: registrations.data[0]?.event?.name?.fi as string },
    { timeout: 20000 }
  );
  await waitFor(() => expect(registrationLink).toHaveFocus());
});
