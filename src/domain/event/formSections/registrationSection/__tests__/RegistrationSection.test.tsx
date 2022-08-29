import { Formik } from 'formik';
import React from 'react';

import { ROUTES } from '../../../../../constants';
import generateAtId from '../../../../../utils/generateAtId';
import { fakeEvent } from '../../../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../../../utils/mockStoreUtils';
import {
  act,
  configure,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import { TEST_PUBLISHER_ID } from '../../../../organization/constants';
import { TEST_REGISTRATION_ID } from '../../../../registration/constants';
import { mockedUserResponse } from '../../../../user/__mocks__/user';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import RegistrationSection, {
  RegistrationSectionProps,
} from '../RegistrationSection';

configure({ defaultHidden: true });

const mocks = [mockedUserResponse];

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const renderComponent = (props: RegistrationSectionProps) =>
  render(
    <Formik
      initialValues={{ [EVENT_FIELDS.TYPE]: EVENT_TYPE.General }}
      onSubmit={jest.fn()}
    >
      <RegistrationSection {...props} />
    </Formik>,
    { mocks, store }
  );

test('should show registration link if event has registration', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    event: fakeEvent({
      registration: {
        atId: generateAtId(TEST_REGISTRATION_ID, 'registration'),
      },
    }),
  });

  const link = screen.getByRole('link', { name: 'Siirry ilmoittautumiseen' });
  await act(async () => await user.click(link));
  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi${ROUTES.EDIT_REGISTRATION.replace(':id', TEST_REGISTRATION_ID)}`
    )
  );
});

test('should show create registration button if user has permissions to create registration', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    event: fakeEvent({ publisher: TEST_PUBLISHER_ID }),
  });

  const createButton = await screen.findByRole('button', {
    name: 'Lisää tapahtumalle ilmoittautuminen',
  });
  await act(async () => await user.click(createButton));
  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi${ROUTES.CREATE_REGISTRATION}`)
  );
});
