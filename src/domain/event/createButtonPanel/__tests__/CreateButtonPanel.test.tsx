import { MockedResponse } from '@apollo/client/testing';
import { Formik } from 'formik';

import {
  mockAuthenticatedLoginState,
  mockUnauthenticatedLoginState,
} from '../../../../utils/mockLoginHooks';
import { configure, render, screen } from '../../../../utils/testUtils';
import { organizationId } from '../../../organization/__mocks__/organization';
import {
  mockedUserResponse,
  mockedUserWithoutOrganizationsResponse,
} from '../../../user/__mocks__/user';
import { EVENT_FIELDS, EVENT_TYPE } from '../../constants';
import ButtonPanel from '../CreateButtonPanel';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const renderComponent = (mocks?: MockedResponse[]) =>
  render(
    <Formik
      initialValues={{ [EVENT_FIELDS.TYPE]: EVENT_TYPE.General }}
      onSubmit={vi.fn()}
    >
      <ButtonPanel
        onSubmit={vi.fn()}
        publisher={organizationId}
        saving={null}
      />
    </Formik>,
    { mocks }
  );

test('publish button should be disabled when user is not authenticated', () => {
  mockUnauthenticatedLoginState();
  renderComponent();

  const buttons = ['Julkaise tapahtuma'];

  buttons.forEach((name) => {
    expect(screen.getByRole('button', { name })).toBeDisabled();
  });
});

test('buttons should be enabled when external user is authenticated', async () => {
  const mocks = [mockedUserWithoutOrganizationsResponse];

  renderComponent(mocks);

  const buttonSaveDraft = await screen.findByRole('button', {
    name: /Tallenna ja lähetä moderoijalle/i,
  });

  expect(buttonSaveDraft).toBeEnabled();
});

test('buttons should be enabled when regular user is authenticated', async () => {
  const mocks = [mockedUserResponse];

  renderComponent(mocks);

  const buttonSaveDraft = await screen.findByRole('button', {
    name: /tallenna luonnos/i,
  });

  const buttons = [buttonSaveDraft];

  for (const button of buttons) {
    expect(button).toBeEnabled();
  }
});
