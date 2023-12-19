import {
  mockAuthenticatedLoginState,
  mockUnauthenticatedLoginState,
} from '../../../utils/mockLoginHooks';
import { configure, render, screen, userEvent } from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import NotFound from '../NotFound';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const renderComponent = () => render(<NotFound />, { routes: ['/fi/events'] });

const getElement = (key: 'buttonHome' | 'buttonSignIn') => {
  switch (key) {
    case 'buttonHome':
      return screen.getByRole('button', { name: 'Etusivulle' });
    case 'buttonSignIn':
      return screen.getByRole('button', { name: 'Kirjaudu sisään' });
  }
};

test('should render not found page', () => {
  renderComponent();

  expect(screen.getByText(translations.notFound.text)).toBeInTheDocument();
  getElement('buttonHome');
  getElement('buttonSignIn');
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
