import { ROUTES } from '../../../../constants';
import getValue from '../../../../utils/getValue';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { TEST_PUBLISHER_ID } from '../../../organization/constants';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import { keyword } from '../../__mocks__/keyword';
import EditButtonPanel, { EditButtonPanelProps } from '../EditButtonPanel';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const mocks = [mockedOrganizationAncestorsResponse, mockedUserResponse];

const route = `/fi/${ROUTES.EDIT_KEYWORD.replace(
  ':id',
  getValue(keyword.id, '')
)}`;
const routes = [route];

const defaultProps: EditButtonPanelProps = {
  id: getValue(keyword.id, ''),
  onSave: vi.fn(),
  publisher: TEST_PUBLISHER_ID,
  saving: null,
};

const renderComponent = (props?: Partial<EditButtonPanelProps>) =>
  render(<EditButtonPanel {...defaultProps} {...props} />, {
    mocks,
    routes,
  });

const getElement = (key: 'backButton' | 'saveButton') => {
  switch (key) {
    case 'backButton':
      return screen.getByRole('button', { name: 'Takaisin' });
    case 'saveButton':
      return screen.getByRole('button', { name: 'Tallenna' });
  }
};

test('should route to keywords page when clicking back button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await user.click(getElement('backButton'));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/keywords`)
  );
});

test('save button should be disabled', async () => {
  renderComponent();

  const saveButton = getElement('saveButton');
  expect(saveButton).toBeDisabled();
});
