import {
  act,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import {
  mockedOrganizationsResponse,
  organizations,
} from '../../../../organizations/__mocks__/organizationsPage';
import SubOrganizationTable, {
  SubOrganizationTableProps,
} from '../SubOrganizationTable';

const props: SubOrganizationTableProps = {
  organizationIds: [organizations.data[0].atId],
  title: 'Aliorganisaatiot',
};

const mocks = [mockedOrganizationsResponse];

const renderComponent = () =>
  render(<SubOrganizationTable {...props} />, { mocks });

test('should render sub organizations', async () => {
  renderComponent();

  screen.getByRole('heading', { name: props.title });
  screen.getByRole('table', {
    name: `${props.title}, järjestys Nimi, nouseva`,
  });
  await loadingSpinnerIsNotInDocument();
  await screen.findByRole('button', { name: organizations.data[0].name });
});

test('should sort sub organizations', async () => {
  renderComponent();

  await loadingSpinnerIsNotInDocument();
  const nameColumn = await screen.findByRole('button', { name: /nimi/i });

  act(() => userEvent.click(nameColumn));
  screen.getByRole('table', {
    name: `${props.title}, järjestys Nimi, laskeva`,
  });
});

test('should open sub organization edit page', async () => {
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();
  const organizationButton = await screen.findByRole('button', {
    name: organizations.data[0].name,
  });

  act(() => userEvent.click(organizationButton));

  expect(history.location.pathname).toBe(
    `/fi/admin/organizations/edit/${organizations.data[0].id}`
  );
});

test('should open sub organization edit page by pressing enter on row', async () => {
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();
  const organizationButton = await screen.findByRole('button', {
    name: organizations.data[0].name,
  });

  act(() => userEvent.type(organizationButton, '{enter}'));

  expect(history.location.pathname).toBe(
    `/fi/admin/organizations/edit/${organizations.data[0].id}`
  );
});
