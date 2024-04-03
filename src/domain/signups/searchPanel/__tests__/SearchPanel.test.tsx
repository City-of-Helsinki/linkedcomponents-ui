import { ROUTES } from '../../../../constants';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  configure,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedEventResponse } from '../../../event/__mocks__/event';
import { registrationId } from '../../../registration/__mocks__/registration';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import SearchPanel from '../SearchPanel';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const getSearchInput = () =>
  screen.getByRole('textbox', { name: /hae osallistujia/i });

const defaultRoute = `${ROUTES.REGISTRATION_SIGNUPS.replace(
  ':registrationId',
  registrationId
)}`;

const mocks = [mockedEventResponse, mockedUserResponse];

const renderComponent = (route: string = defaultRoute) =>
  render(<SearchPanel />, {
    mocks,
    routes: [route],
  });

test('should initialize search panel input', async () => {
  const searchValue = 'search';
  renderComponent(`${defaultRoute}?signupText=${searchValue}`);

  const searchInput = getSearchInput();
  await waitFor(() => expect(searchInput).toHaveValue(searchValue));
});

test('should search signups with correct search params', async () => {
  const values = { text: 'search' };
  const user = userEvent.setup();
  const { history } = renderComponent();

  // Text filtering
  const searchInput = getSearchInput();
  fireEvent.change(searchInput, { target: { value: values.text } });
  await waitFor(() => expect(searchInput).toHaveValue(values.text));

  const searchButton = screen.getAllByRole('button', {
    name: /etsi osallistujia/i,
  })[1];
  await user.click(searchButton);

  expect(history.location.pathname).toBe(
    `/registrations/${registrationId}/signups`
  );
  expect(history.location.search).toBe('?signupText=search');
});
