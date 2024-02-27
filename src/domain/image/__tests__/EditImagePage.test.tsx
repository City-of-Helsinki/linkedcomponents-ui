import { MockedResponse } from '@apollo/client/testing';

import { ROUTES } from '../../../constants';
import getValue from '../../../utils/getValue';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  renderWithRoute,
  screen,
  shouldDeleteInstance,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  image,
  mockedDeleteImageResponse,
  mockedImageResponse,
  mockedInvalidUpdateImageResponse,
  mockedUpdateImageResponse,
} from '../__mocks__/editImagePage';
import EditImagePage from '../EditImagePage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultMocks = [
  mockedImageResponse,
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const route = ROUTES.EDIT_IMAGE.replace(':id', getValue(image.id, ''));

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  renderWithRoute(<EditImagePage />, {
    mocks,
    routes: [route],
    path: ROUTES.EDIT_IMAGE,
  });

const findElement = (key: 'deleteButton' | 'nameInput') => {
  switch (key) {
    case 'deleteButton':
      return screen.findByRole('button', { name: /poista kuva/i });
    case 'nameInput':
      return screen.findByLabelText(/kuvateksti/i);
  }
};

const getSaveButton = () => screen.getByRole('button', { name: /tallenna/i });

test('should scroll to first validation error input field', async () => {
  const user = userEvent.setup();
  renderComponent();

  const nameInput = await findElement('nameInput');
  await user.clear(nameInput);
  const saveButton = getSaveButton();
  await user.click(saveButton);

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should delete image', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeleteImageResponse,
  ]);

  await shouldDeleteInstance({
    confirmDeleteButtonLabel: 'Poista kuva',
    deleteButtonLabel: 'Poista kuva',
    expectedNotificationText: 'Kuva on poistettu',
    expectedUrl: '/fi/administration/images',
    history,
  });
});

test('should update image', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedUpdateImageResponse,
  ]);

  await findElement('nameInput');

  const saveButton = getSaveButton();
  await user.click(saveButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/images`)
  );
  await screen.findByRole('alert', { name: 'Kuva on tallennettu' });
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidUpdateImageResponse]);

  await findElement('nameInput');

  const saveButton = getSaveButton();
  await user.click(saveButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});
