import {
  mockAuthenticatedLoginState,
  mockUnauthenticatedLoginState,
} from '../../../utils/mockLoginHooks';
import { configure, render, screen, userEvent } from '../../../utils/testUtils';
import NotSigned from '../NotSigned';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const renderComponent = () => render(<NotSigned />, { routes: ['/fi/events'] });

const getElement = (key: 'goToHomeButton' | 'signInButton' | 'text') => {
  switch (key) {
    case 'goToHomeButton':
      return screen.getByRole('button', { name: 'Etusivulle' });
    case 'signInButton':
      return screen.getByRole('button', { name: 'Kirjaudu sisään' });
    case 'text':
      return screen.getByText(
        'Sinun täytyy olla kirjautuneena sisään tarkastellaksesi tätä sisältöä. Kirjaudu sisään tai palaa etusivulle.'
      );
  }
};

test('should render not signed page', async () => {
  renderComponent();

  getElement('text');
  getElement('signInButton');
  getElement('goToHomeButton');
});

test('should route to home page', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent();

  const goToHomeButton = getElement('goToHomeButton');
  await user.click(goToHomeButton);

  expect(history.location.pathname).toBe('/fi/');
});

test('should start login process', async () => {
  const user = userEvent.setup();

  const login = vi.fn();
  mockUnauthenticatedLoginState({ login });
  renderComponent();

  const signInButton = getElement('signInButton');
  await user.click(signInButton);

  expect(login).toBeCalled();
});
