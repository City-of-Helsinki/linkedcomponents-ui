import { MockedResponse } from '@apollo/client/testing';

import {
  mockedKeywordResponse,
  mockedKeywordsResponse,
} from '../../../common/components/keywordSelector/__mocks__/keywordSelector';
import { ROUTES } from '../../../constants';
import getValue from '../../../utils/getValue';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  renderWithRoute,
  screen,
} from '../../../utils/testUtils';
import { mockedKeywordSetsResponse } from '../../keywordSets/__mocks__/keywordSetsPage';
import { mockedOrganizationResponse } from '../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  keywordSet,
  mockedKeywordSetResponse,
} from '../__mocks__/editKeywordSetPage';
import EditKeywordSetPage from '../EditKeywordSetPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultMocks = [
  mockedKeywordSetResponse,
  mockedKeywordSetsResponse,
  mockedKeywordResponse,
  mockedKeywordsResponse,
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const route = ROUTES.EDIT_KEYWORD_SET.replace(
  ':id',
  getValue(keywordSet.id, '')
);

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  renderWithRoute(<EditKeywordSetPage />, {
    mocks,
    routes: [route],
    path: ROUTES.EDIT_KEYWORD_SET,
  });

const getNameInput = () => screen.getByLabelText(/nimi \(suomeksi\)/i);

test('form should be disabled', async () => {
  renderComponent();

  await loadingSpinnerIsNotInDocument();
  const nameInput = getNameInput();
  expect(nameInput).toHaveAttribute('readOnly');
});
