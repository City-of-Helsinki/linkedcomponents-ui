import { Formik } from 'formik';
import React from 'react';

import { ROUTES } from '../../../../../constants';
import {
  PublicationStatus,
  SuperEventType,
} from '../../../../../generated/graphql';
import generateAtId from '../../../../../utils/generateAtId';
import { fakeAuthenticatedAuthContextValue } from '../../../../../utils/mockAuthContextValue';
import { fakeEvent } from '../../../../../utils/mockDataUtils';
import {
  act,
  configure,
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

const authContextValue = fakeAuthenticatedAuthContextValue();

const renderComponent = (props: RegistrationSectionProps) =>
  render(
    <Formik
      initialValues={{ [EVENT_FIELDS.TYPE]: EVENT_TYPE.General }}
      onSubmit={jest.fn()}
    >
      <RegistrationSection {...props} />
    </Formik>,
    { authContextValue, mocks }
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
    event: fakeEvent({
      publicationStatus: PublicationStatus.Public,
      publisher: TEST_PUBLISHER_ID,
    }),
  });

  const createButton = await screen.findByRole('button', {
    name: 'Lisää tapahtumalle ilmoittautuminen',
  });
  await act(async () => await user.click(createButton));
  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi${ROUTES.CREATE_REGISTRATION}`)
  );
});

test('should not show create registration button for draft event', async () => {
  renderComponent({
    event: fakeEvent({
      publicationStatus: PublicationStatus.Draft,
      publisher: TEST_PUBLISHER_ID,
    }),
  });

  expect(
    screen.queryByRole('button', {
      name: 'Lisää tapahtumalle ilmoittautuminen',
    })
  ).not.toBeInTheDocument();
});

test('should not show create registration button for umbrella event', async () => {
  renderComponent({
    event: fakeEvent({
      publicationStatus: PublicationStatus.Public,
      publisher: TEST_PUBLISHER_ID,
      superEventType: SuperEventType.Umbrella,
    }),
  });

  expect(
    screen.queryByRole('button', {
      name: 'Lisää tapahtumalle ilmoittautuminen',
    })
  ).not.toBeInTheDocument();
});
