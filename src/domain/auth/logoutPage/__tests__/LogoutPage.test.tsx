import {
  mockAuthenticatedLoginState,
  mockUnauthenticatedLoginState,
} from '../../../../utils/mockLoginHooks';
import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import LogoutPage from '../LogoutPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockUnauthenticatedLoginState();
});

const renderComponent = () =>
  render(<LogoutPage />, { routes: ['/fi/events'] });

const getElement = (key: 'buttonHome' | 'buttonSignIn' | 'text') => {
  switch (key) {
    case 'buttonHome':
      return screen.getByRole('button', { name: 'Takaisin etusivulle' });
    case 'buttonSignIn':
      return screen.getByRole('button', { name: 'Kirjaudu sisään' });
    case 'text':
      return screen.getByText(
        'Olet kirjautunut ulos palvelusta. Kirjaudu takaisin sisään tai palaa etusivulle.'
      );
  }
};

test('should render logout page', () => {
  renderComponent();

  getElement('text');
  getElement('buttonSignIn');
  getElement('buttonHome');
});

test('should route to home page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await user.click(getElement('buttonHome'));

  expect(history.location.pathname).toBe('/fi/');
});

test('should start login process', async () => {
  const user = userEvent.setup();

  const login = vi.fn();
  mockUnauthenticatedLoginState({ login });
  renderComponent();

  await user.click(getElement('buttonSignIn'));

  expect(login).toBeCalled();
});

test('should redirect to home page when user is authenticated', () => {
  mockAuthenticatedLoginState();
  const { history } = renderComponent();

  expect(history.location.pathname).toBe('/fi/');
});
