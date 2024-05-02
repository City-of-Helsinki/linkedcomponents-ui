/* eslint-disable max-len */
import { MockedResponse } from '@apollo/client/testing';

import { ROUTES } from '../../../constants';
import getValue from '../../../utils/getValue';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  renderWithRoute,
  screen,
} from '../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  keyword,
  mockedKeywordResponse,
  mockedKeywordsResponse,
} from '../__mocks__/editKeywordPage';
import EditKeywordPage from '../EditKeywordPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultMocks = [
  mockedKeywordResponse,
  mockedKeywordsResponse,
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const route = ROUTES.EDIT_KEYWORD.replace(':id', getValue(keyword.id, ''));

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  renderWithRoute(<EditKeywordPage />, {
    mocks,
    routes: [route],
    path: ROUTES.EDIT_KEYWORD,
  });
const getNameInput = () => screen.getByLabelText(/nimi \(suomeksi\)/i);

test('form should be disabled', async () => {
  renderComponent();

  await loadingSpinnerIsNotInDocument();
  const nameInput = getNameInput();
  expect(nameInput).toHaveAttribute('readOnly');
});
