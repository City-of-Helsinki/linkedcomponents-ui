import { MockedResponse } from '@apollo/client/testing';

import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  shouldApplyExpectedMetaData,
} from '../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../organization/__mocks__/organization';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  mockedFilteredKeywordsResponse,
  mockedKeywordsResponse,
} from '../__mocks__/createKeyword';
import CreateKeywordPage from '../CreateKeywordPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultMocks = [
  mockedKeywordsResponse,
  mockedFilteredKeywordsResponse,
  mockedOrganizationResponse,
  mockedUserResponse,
];

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  render(<CreateKeywordPage />, { mocks });

const getNameInput = () => screen.getByLabelText(/nimi \(suomeksi\)/i);

test('form should be disabled', async () => {
  render(<CreateKeywordPage />, { mocks: defaultMocks });

  await loadingSpinnerIsNotInDocument();
  const nameInput = getNameInput();
  expect(nameInput).toHaveAttribute('readOnly');
});

test('applies expected metadata', async () => {
  renderComponent();

  await shouldApplyExpectedMetaData({
    expectedDescription: 'Lisää uusi avainsana Linked Eventsiin.',
    expectedKeywords:
      'lisää, uusi, avainsana, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    expectedTitle: 'Lisää avainsana - Linked Events',
  });
});
