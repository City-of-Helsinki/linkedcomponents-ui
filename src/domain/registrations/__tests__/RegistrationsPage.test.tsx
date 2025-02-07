/* eslint-disable max-len */
import { createMemoryHistory } from 'history';

import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  shouldApplyExpectedMetaData,
  shouldClickListPageCreateButton,
  shouldRenderListPage,
  waitFor,
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

test('should show correct title, description and keywords', async () => {
  render(<RegistrationsPage />, { mocks });

  await shouldApplyExpectedMetaData({
    expectedDescription:
      'Ilmoittautumisten listaus. Selaa, suodata ja muokkaa ilmoittautumisiasi.',
    expectedKeywords:
      'ilmoittautuminen, lista, muokkaa, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    expectedTitle: 'Ilmoittautuminen - Linked Events',
  });
});

test('should render registrations page', async () => {
  render(<RegistrationsPage />, { mocks });

  await loadingSpinnerIsNotInDocument(10000);

  await shouldRenderListPage({
    createButtonLabel: 'Lisää uusi',
    heading: 'Ilmoittautuminen',
    searchInputLabel: 'Hae ilmoittautumisia',
    tableCaption: /ilmoittautumiset, järjestys tapahtuman loppuaika, laskeva/i,
  });
});

test('should open create registration page', async () => {
  const { history } = render(<RegistrationsPage />, {
    mocks,
  });

  await shouldClickListPageCreateButton({
    createButtonLabel: 'Lisää uusi',
    expectedPathname: '/fi/registrations/create',
    history,
  });
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
