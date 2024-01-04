/* eslint-disable @typescript-eslint/no-explicit-any */
import copyToClipboard from 'copy-to-clipboard';

import { ROUTES } from '../../../../constants';
import {
  mockAuthenticatedLoginState,
  mockUnauthenticatedLoginState,
} from '../../../../utils/mockLoginHooks';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { shouldExportSignupsAsExcel } from '../../../signups/__tests__/testUtils';
import { mockedRegistrationUserResponse } from '../../../user/__mocks__/user';
import {
  publisher,
  registration,
  registrationId,
} from '../../__mocks__/editRegistrationPage';
import EditButtonPanel, { EditButtonPanelProps } from '../EditButtonPanel';

configure({ defaultHidden: true });
vi.mock('copy-to-clipboard');

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultProps: EditButtonPanelProps = {
  onDelete: vi.fn(),
  onUpdate: vi.fn(),
  publisher,
  registration,
  saving: null,
};

const mocks = [
  mockedOrganizationAncestorsResponse,
  mockedRegistrationUserResponse,
];

const renderComponent = ({
  props,
  route = `/fi${ROUTES.EDIT_REGISTRATION.replace(':id', registrationId)}`,
}: {
  props?: Partial<EditButtonPanelProps>;
  route?: string;
} = {}) =>
  render(<EditButtonPanel {...defaultProps} {...props} />, {
    mocks,
    routes: [route],
  });

const findElement = (key: 'delete' | 'showSignups') => {
  switch (key) {
    case 'delete':
      return screen.findByRole('button', { name: 'Poista ilmoittautuminen' });
    case 'showSignups':
      return screen.findByRole('button', { name: /näytä ilmoittautuneet/i });
  }
};

const getElement = (
  key:
    | 'back'
    | 'copy'
    | 'copyLink'
    | 'delete'
    | 'exportAsExcel'
    | 'markPresent'
    | 'menu'
    | 'showSignups'
    | 'toggle'
    | 'update'
) => {
  switch (key) {
    case 'back':
      return screen.getByRole('button', { name: /takaisin/i });
    case 'copy':
      return screen.getByRole('button', { name: /kopioi pohjaksi/i });
    case 'copyLink':
      return screen.getByRole('button', { name: /kopioi linkk/i });
    case 'delete':
      return screen.getByRole('button', { name: 'Poista ilmoittautuminen' });
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
    case 'update':
      return screen.getByRole('button', { name: 'Tallenna muutokset' });
  }
};

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

test('should render all buttons when user is authenticated', async () => {
  const onDelete = vi.fn();
  const onUpdate = vi.fn();

  const user = userEvent.setup();
  renderComponent({ props: { onDelete, onUpdate } });

  await openMenu();

  await findElement('showSignups');
  getElement('copy');
  getElement('copyLink');

  const deleteButton = await findElement('delete');
  await user.click(deleteButton);
  expect(onDelete).toBeCalled();

  const updateButton = getElement('update');
  await user.click(updateButton);
  expect(onUpdate).toBeCalled();
});

test('all buttons should be disabled when user is not logged in', async () => {
  mockUnauthenticatedLoginState();
  renderComponent();

  await openMenu();

  const disabledButtons = [
    getElement('copy'),
    getElement('copyLink'),
    getElement('markPresent'),
    getElement('showSignups'),
    getElement('delete'),
    getElement('update'),
  ];
  expect(disabledButtons).toHaveLength(6);
  disabledButtons.forEach((button) => expect(button).toBeDisabled());
});

test('should route to signups page when clicking show signups button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await openMenu();

  const showSignupsButton = await findElement('showSignups');
  await user.click(showSignupsButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/signups`
    )
  );
});

test('should route to attendance list page when clicking mark present button', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent();

  await openMenu();

  const markPresentButton = getElement('markPresent');
  await waitFor(() => expect(markPresentButton).toBeEnabled());
  await user.click(markPresentButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/attendance-list`
    )
  );
  expect(decodeURIComponent(history.location.search)).toBe(
    `?returnPath=/registrations/edit/${registration.id}`
  );
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
    expect(history.location.pathname).toBe('/fi/registrations/create')
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

test('should route to search page when clicking back button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  const backButton = getElement('back');
  await user.click(backButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/registrations')
  );
});

test('should route to page defined in returnPath when clicking back button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    route: `/fi${ROUTES.REGISTRATION_SIGNUPS}?returnPath=${ROUTES.SEARCH}&returnPath=${ROUTES.REGISTRATIONS}`,
  });

  const backButton = getElement('back');
  await user.click(backButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/registrations')
  );
  expect(history.location.search).toBe(`?returnPath=%2Fsearch`);
});

test('menu toggle button should be visible and accessible for mobile devices', async () => {
  global.innerWidth = 500;
  renderComponent();

  getElement('toggle');
});
