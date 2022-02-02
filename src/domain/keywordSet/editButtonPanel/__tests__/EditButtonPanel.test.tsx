import { ROUTES } from '../../../../constants';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  configure,
  CustomRenderOptions,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { TEST_PUBLISHER_ID } from '../../../organization/constants';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import { keywordSet } from '../../__mocks__/editKeywordSetPage';
import EditButtonPanel, { EditButtonPanelProps } from '../EditButtonPanel';

configure({ defaultHidden: true });

const mocks = [mockedUserResponse];

const state = fakeAuthenticatedStoreState();
const defaultStore = getMockReduxStore(state);

const defaultProps: EditButtonPanelProps = {
  id: keywordSet.id,
  onSave: jest.fn(),
  publisher: TEST_PUBLISHER_ID,
  saving: null,
};

const route = `/fi/${ROUTES.EDIT_KEYWORD_SET.replace(':id', keywordSet.id)}`;

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

test('should route to keyword sets page when clicking back button', async () => {
  const { history } = renderComponent();

  userEvent.click(getElement('backButton'));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/admin/keyword-sets`)
  );
});

test('should call onSave', async () => {
  const onSave = jest.fn();
  renderComponent({ onSave });

  const saveButton = await findElement('saveButton');
  userEvent.click(saveButton);

  expect(onSave).toBeCalled();
});
