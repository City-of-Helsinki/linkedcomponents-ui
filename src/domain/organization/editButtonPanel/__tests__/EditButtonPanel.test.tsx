import { ROUTES } from '../../../../constants';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  act,
  configure,
  CustomRenderOptions,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import {
  mockedOrganizationResponse,
  organizationId,
} from '../../../organization/__mocks__/organization';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import EditButtonPanel, { EditButtonPanelProps } from '../EditButtonPanel';

configure({ defaultHidden: true });

const mocks = [mockedOrganizationResponse, mockedUserResponse];

const state = fakeAuthenticatedStoreState();
const defaultStore = getMockReduxStore(state);

const defaultProps: EditButtonPanelProps = {
  id: organizationId,
  onSave: jest.fn(),
  saving: null,
};

const route = `/fi/${ROUTES.EDIT_ORGANIZATION.replace(':id', organizationId)}`;

const renderComponent = (
  props?: Partial<EditButtonPanelProps>,
  { store = defaultStore }: CustomRenderOptions = {}
) =>
  render(<EditButtonPanel {...defaultProps} {...props} />, {
    mocks,
    routes: [route],
    store,
  });

const findElement = (key: 'saveButton') => {
  switch (key) {
    case 'saveButton':
      return screen.findByRole('button', { name: 'Tallenna' });
  }
};

const getElement = (key: 'backButton' | 'saveButton') => {
  switch (key) {
    case 'backButton':
      return screen.getByRole('button', { name: 'Takaisin' });
    case 'saveButton':
      return screen.getByRole('button', { name: 'Tallenna' });
  }
};

test('should route to organizations page when clicking back button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await act(async () => await user.click(getElement('backButton')));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/organizations`)
  );
});

test('should call onSave', async () => {
  const onSave = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onSave });

  const saveButton = await findElement('saveButton');
  await waitFor(() => expect(saveButton).toBeEnabled());
  await act(async () => await user.click(saveButton));

  expect(onSave).toBeCalled();
});
