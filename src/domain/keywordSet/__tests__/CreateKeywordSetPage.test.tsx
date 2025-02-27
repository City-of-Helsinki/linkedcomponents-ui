/* eslint-disable max-len */
import { MockedResponse } from '@apollo/client/testing';

import {
  mockedKeywordResponse as mockedKeywordSelectorKeywordResponse,
  mockedKeywordsResponse as mockedKeywordSelectorKeywordsResponse,
} from '../../../common/components/keywordSelector/__mocks__/keywordSelector';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  shouldApplyExpectedMetaData,
} from '../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../user/__mocks__/user';
import CreateKeywordSetPage from '../CreateKeywordSetPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultMocks = [
  mockedKeywordSelectorKeywordResponse,
  mockedKeywordSelectorKeywordsResponse,
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  render(<CreateKeywordSetPage />, { mocks });

const getNameInput = () => screen.getByLabelText(/nimi \(suomeksi\)/i);

test('applies expected metadata', async () => {
  renderComponent();

  await shouldApplyExpectedMetaData({
    expectedDescription: 'Lisää uusi avainsanaryhmä Linked Eventsiin.',
    expectedKeywords:
      'lisää, uusi, avainsana, ryhmä, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    expectedTitle: 'Lisää avainsanaryhmä - Linked Events',
  });
});

test('form should be disabled', async () => {
  renderComponent();

  await loadingSpinnerIsNotInDocument();
  const nameInput = getNameInput();
  expect(nameInput).toHaveAttribute('readOnly');
});
