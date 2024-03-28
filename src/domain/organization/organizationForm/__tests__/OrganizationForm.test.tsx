import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import {
  mockedOrganizationClassesResponse,
  mockedOrganizationClassResponse,
} from '../../../organizationClass/__mocks__/organizationClass';
import { mockedOrganizationsResponse } from '../../../organizations/__mocks__/organizationsPage';
import {
  mockedSuperuserResponse,
  mockedUsersResponse,
} from '../../../user/__mocks__/user';
import OrganizationForm from '../OrganizationForm';

const defaultMocks = [
  mockedOrganizationsResponse,
  mockedOrganizationClassResponse,
  mockedOrganizationClassesResponse,
  mockedSuperuserResponse,
  mockedUsersResponse,
];

const renderComponent = () =>
  render(<OrganizationForm />, { mocks: defaultMocks });

const getElement = (
  key: 'addMerchantButton' | 'deleteMercantButton' | 'paytrailMerchantIdInput'
) => {
  switch (key) {
    case 'addMerchantButton':
      return screen.getByRole('button', { name: 'Lisää uusi kauppias' });
    case 'deleteMercantButton':
      return screen.getByRole('button', { name: 'Poista kauppias' });
    case 'paytrailMerchantIdInput':
      return screen.getByRole('textbox', { name: 'Paytrail-kauppiastunnus *' });
  }
};

test('should add and remove price group', async () => {
  mockAuthenticatedLoginState();
  const user = userEvent.setup();

  renderComponent();
  await loadingSpinnerIsNotInDocument();

  await user.click(getElement('addMerchantButton'));

  getElement('paytrailMerchantIdInput');

  expect(
    screen.queryByRole('button', { name: 'Lisää uusi kauppias' })
  ).not.toBeInTheDocument();

  await user.click(getElement('deleteMercantButton'));
  expect(
    screen.queryByRole('textbox', { name: 'Paytrail-kauppiastunnus *' })
  ).not.toBeInTheDocument();
});
