import {
  mockAuthenticatedLoginState,
  mockUnauthenticatedLoginState,
} from '../../../../utils/mockLoginHooks';
import {
  configure,
  render,
  screen,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import CreateButtonPanel from '../CreateButtonPanel';

configure({ defaultHidden: true });

beforeEach(() => {
  vi.resetAllMocks();
});

const mocks = [mockedUserResponse];

const renderComponent = () =>
  render(<CreateButtonPanel onSave={vi.fn()} saving={null} />, {
    mocks,
  });

const getSaveButton = () =>
  screen.getByRole('button', { name: 'Tallenna ilmoittautuminen' });

test('button should be disabled when user is not authenticated', () => {
  mockUnauthenticatedLoginState();
  renderComponent();

  const saveButton = getSaveButton();
  expect(saveButton).toBeDisabled();
});

test('button should be enabled when user is authenticated', async () => {
  mockAuthenticatedLoginState();
  renderComponent();

  const saveButton = await getSaveButton();
  await waitFor(() => expect(saveButton).toBeEnabled());
});
