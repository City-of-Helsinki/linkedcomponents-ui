/* eslint-disable @typescript-eslint/no-explicit-any */
import copyToClipboard from 'copy-to-clipboard';

import { ROUTES } from '../../../../constants';
import {
  mockAuthenticatedLoginState,
  mockUnauthenticatedLoginState,
} from '../../../../utils/mockLoginHooks';
import {
  configure,
  CustomRenderOptions,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import {
  mockedDeleteRegistrationResponse,
  registration,
} from '../../../registration/__mocks__/editRegistrationPage';
import { shouldExportSignupsAsExcel } from '../../../signups/__tests__/testUtils';
import { mockedRegistrationUserResponse } from '../../../user/__mocks__/user';
import RegistrationActionsDropdown, {
  RegistrationActionsDropdownProps,
} from '../RegistrationActionsDropdown';

configure({ defaultHidden: true });
vi.mock('copy-to-clipboard');

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
  localStorage.clear();
  sessionStorage.clear();
});

const defaultProps: RegistrationActionsDropdownProps = {
  registration,
};

const defaultMocks = [
  mockedOrganizationAncestorsResponse,
  mockedRegistrationUserResponse,
];

const routes = [`/fi${ROUTES.REGISTRATIONS}`];

const renderComponent = ({
  mocks = defaultMocks,
  ...restRenderOptions
}: CustomRenderOptions = {}) =>
  render(<RegistrationActionsDropdown {...defaultProps} />, {
    mocks,
    routes,
    ...restRenderOptions,
  });

const findElement = (key: 'delete' | 'edit' | 'showSignups') => {
  switch (key) {
    case 'delete':
      return screen.findByRole('button', { name: 'Poista ilmoittautuminen' });
    case 'edit':
      return screen.findByRole('button', { name: 'Muokkaa' });
    case 'showSignups':
      return screen.findByRole('button', { name: /näytä ilmoittautuneet/i });
  }
};

const getElement = (
  key:
    | 'copy'
    | 'copyLink'
    | 'delete'
    | 'edit'
    | 'exportAsExcel'
    | 'markPresent'
    | 'menu'
    | 'showSignups'
    | 'toggle'
) => {
  switch (key) {
    case 'copy':
      return screen.getByRole('button', { name: 'Kopioi pohjaksi' });
    case 'copyLink':
      return screen.getByRole('button', { name: 'Kopioi linkki' });
    case 'delete':
      return screen.getByRole('button', { name: 'Poista ilmoittautuminen' });
    case 'edit':
      return screen.getByRole('button', { name: 'Muokkaa' });
    case 'exportAsExcel':
      return screen.getByRole('button', {
        name: 'Lataa osallistujalista (Excel)',
      });
    case 'markPresent':
      return screen.getByRole('button', { name: 'Merkkaa läsnäolijat' });
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
    case 'showSignups':
      return screen.getByRole('button', { name: /näytä ilmoittautuneet/i });
    case 'toggle':
      return screen.getByRole('button', { name: /valinnat/i });
  }
};

const titleDisabled = 'Sinulla ei ole oikeuksia muokata ilmoittautumisia.';

const openMenu = async () => {
  const user = userEvent.setup();
  const toggleButton = getElement('toggle');
  await user.click(toggleButton);
  getElement('menu');

  return toggleButton;
};

test('should toggle menu by clicking actions button', async () => {
  const user = userEvent.setup();

  renderComponent();

  const toggleButton = await openMenu();
  await user.click(toggleButton);
  expect(
    screen.queryByRole('region', { name: /valinnat/i })
  ).not.toBeInTheDocument();
});

test('should render correct buttons', async () => {
  renderComponent();

  await openMenu();

  getElement('copy');
  getElement('copyLink');
  await findElement('delete');
  getElement('edit');
  getElement('showSignups');
});

test('only copy, copy link and edit buttons should be enabled when user is not logged in', async () => {
  mockUnauthenticatedLoginState();
  renderComponent();

  await openMenu();

  getElement('copy');
  getElement('copyLink');
  getElement('edit');
  const showSignupsButton = getElement('showSignups');
  expect(showSignupsButton.title).toBe(titleDisabled);
  const deleteButton = getElement('delete');
  expect(deleteButton.title).toBe(titleDisabled);
});

test('should route to edit registration page when clicking edit button', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent();

  await openMenu();

  const editButton = await findElement('edit');
  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/edit/${registration.id}`
    )
  );
  expect(history.location.search).toBe('?returnPath=%2Fregistrations');
});

test('should route to signups page when clicking show signups button', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent();

  await openMenu();

  const editButton = await findElement('showSignups');
  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/signups`
    )
  );
  expect(history.location.search).toBe('?returnPath=%2Fregistrations');
});

test('should route to attendance list page when clicking mark present button', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent();

  await openMenu();

  const markPresentButton = getElement('markPresent');
  await user.click(markPresentButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/attendance-list`
    )
  );
  expect(history.location.search).toBe('?returnPath=%2Fregistrations');
});

test('should export signups as an excel after clicking export as excel button', async () => {
  renderComponent();
  await openMenu();
  const exportAsExcelButton = getElement('exportAsExcel');

  await shouldExportSignupsAsExcel({ exportAsExcelButton, registration });
});

test('should route to create registration page when clicking copy button', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent();

  await openMenu();

  const copyButton = getElement('copy');
  await user.click(copyButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/registrations/create`)
  );
});

test('should copy registration link to clipboard', async () => {
  const user = userEvent.setup();

  renderComponent();

  await openMenu();

  const copyLinkButton = getElement('copyLink');
  await user.click(copyLinkButton);

  expect(copyToClipboard).toBeCalled();
  await screen.findByRole('alert', { name: 'Ilmoittautumislinkki kopioitu' });
});

test('should delete registration', async () => {
  const user = userEvent.setup();

  const mocks = [...defaultMocks, mockedDeleteRegistrationResponse];
  renderComponent({ mocks });

  await openMenu();

  const deleteButton = await findElement('delete');
  await user.click(deleteButton);

  const withinModal = within(screen.getByRole('dialog'));
  const deleteRegistrationButton = withinModal.getByRole('button', {
    name: 'Poista ilmoittautuminen',
  });
  await user.click(deleteRegistrationButton);

  await waitFor(
    () => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    { timeout: 10000 }
  );
  await screen.findByRole('alert', { name: 'Ilmoittautuminen on poistettu' });
});
