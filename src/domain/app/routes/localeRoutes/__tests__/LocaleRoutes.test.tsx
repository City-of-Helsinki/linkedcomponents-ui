import { History } from 'history';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { DEPRECATED_ROUTES, ROUTES } from '../../../../../constants';
import { setFeatureFlags } from '../../../../../test/featureFlags/featureFlags';
import { Language } from '../../../../../types';
import { fakeAuthenticatedStoreState } from '../../../../../utils/mockStoreUtils';
import {
  act,
  configure,
  getMockReduxStore,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  waitFor,
} from '../../../../../utils/testUtils';
import {
  enrolmentId,
  mockedEnrolmentResponse,
} from '../../../../enrolment/__mocks__/editEnrolmentPage';
import {
  eventName,
  mockedEventResponse,
} from '../../../../event/__mocks__/event';
import {
  mockedEventsResponse,
  mockedPlacesResponse,
  searchText,
} from '../../../../eventSearch/__mocks__/eventSearchPage';
import {
  image,
  mockedImageResponse,
  mockedImagesResponse,
} from '../../../../image/__mocks__/image';
import {
  keyword,
  mockedKeywordResponse,
} from '../../../../keyword/__mocks__/editKeywordPage';
import {
  keywordSet,
  mockedKeywordSetResponse,
} from '../../../../keywordSet/__mocks__/editKeywordSetPage';
import {
  mockedOrganizationResponse,
  organizationId,
} from '../../../../organization/__mocks__/organization';
import {
  mockedPlaceResponse,
  place,
} from '../../../../place/__mocks__/editPlacePage';
import {
  mockedRegistrationResponse,
  registrationId,
} from '../../../../registration/__mocks__/editRegistrationPage';
import { mockedUserResponse } from '../../../../user/__mocks__/user';
import LocaleRoutes from '../LocaleRoutes';

configure({ defaultHidden: true });

let history: History;
const storeState = fakeAuthenticatedStoreState();
const store = getMockReduxStore(storeState);

const mocks = [
  mockedEnrolmentResponse,
  mockedEventResponse,
  mockedEventsResponse,
  mockedImageResponse,
  mockedImagesResponse,
  mockedKeywordResponse,
  mockedKeywordSetResponse,
  mockedOrganizationResponse,
  mockedPlaceResponse,
  mockedPlacesResponse,
  mockedRegistrationResponse,
  mockedUserResponse,
];

const renderRoute = (route: string, locale: Language = 'fi') =>
  render(
    <Routes>
      <Route path={`/:locale/*`} element={<LocaleRoutes />} />
    </Routes>,
    {
      mocks,
      routes: [`/${locale}${route}`],
      store,
    }
  );

beforeEach(() => {
  setFeatureFlags({ SHOW_ADMIN: true, SHOW_REGISTRATION: true });
});

it('should redirect to events page from deprecated modaration page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(DEPRECATED_ROUTES.MODERATION);
    history = newHistory;
  });

  await waitFor(() => expect(history.location.pathname).toBe('/fi/events'));
});

it('should redirect to create event page from deprecated create event page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(DEPRECATED_ROUTES.CREATE_EVENT);
    history = newHistory;
  });

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/events/create')
  );
});

it('should redirect to edit event page from deprecated edit event page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(
      DEPRECATED_ROUTES.UPDATE_EVENT.replace(':id', 'hel:123')
    );
    history = newHistory;
  });

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/events/edit/hel:123')
  );
});

it('should redirect to edit event page from deprecated event page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(
      DEPRECATED_ROUTES.VIEW_EVENT.replace(':id', 'hel:123')
    );
    history = newHistory;
  });

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/events/edit/hel:123')
  );
});

it('should redirect to terms of use page from deprecated terms page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(DEPRECATED_ROUTES.TERMS);
    history = newHistory;
  });

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/help/support/terms-of-use')
  );
});

it('should render event search page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(
      `${ROUTES.SEARCH}?text=${searchText}`
    );
    history = newHistory;
  });

  await screen.findByRole('searchbox', {
    name: /hae linked events -rajapinnasta/i,
  });
  expect(history.location.pathname).toBe('/fi/search');
});

it('should render registrations page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(
      `${ROUTES.REGISTRATIONS}?text=${searchText}`
    );
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: /ilmoittautuminen/i });
  });
  expect(history.location.pathname).toBe('/fi/registrations');
});

it('should render create registration page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(
      `${ROUTES.CREATE_REGISTRATION}`
    );
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: /ilmoittautumisaika/i });
  });
  expect(history.location.pathname).toBe('/fi/registrations/create');
});

it('should render edit registration page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(
      `${ROUTES.EDIT_REGISTRATION.replace(':id', registrationId)}`
    );
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: /ilmoittautumisaika/i });
  });
  expect(history.location.pathname).toBe(
    `/fi/registrations/edit/${registrationId}`
  );
});

it('should render registration enrolments page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(
      `${ROUTES.REGISTRATION_ENROLMENTS.replace(
        ':registrationId',
        registrationId
      )}`
    );
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: eventName }, { timeout: 30000 });
  });
  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/enrolments`
  );
});

it('should render create enrolment page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(
      `${ROUTES.CREATE_ENROLMENT.replace(':registrationId', registrationId)}`
    );
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByText(/ilmoittautujan perustiedot/i);
  });
  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/enrolments/create`
  );
});

it('should render edit enrolment page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(
      `${ROUTES.EDIT_REGISTRATION_ENROLMENT.replace(
        ':registrationId',
        registrationId
      ).replace(':enrolmentId', enrolmentId)}`
    );
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByText(/ilmoittautujan perustiedot/i);
  });
  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/enrolments/edit/${enrolmentId}`
  );
});

it('should render images page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(`${ROUTES.IMAGES}`);
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: /kuvat/i });
  });
  expect(history.location.pathname).toBe('/fi/administration/images');
});

it('should render create image page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(`${ROUTES.CREATE_IMAGE}`);
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: /lisää kuva/i });
  });
  expect(history.location.pathname).toBe('/fi/administration/images/create');
});

it('should render edit image page', async () => {
  const id = image.id;
  await act(() => {
    const { history: newHistory } = renderRoute(
      `${ROUTES.EDIT_IMAGE.replace(':id', id)}`
    );
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: /muokkaa kuvaa/i });
  });
  expect(history.location.pathname).toBe(
    `/fi/administration/images/edit/${id}`
  );
});

it('should render keywords page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(`${ROUTES.KEYWORDS}`);
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: /avainsanat/i });
  });
  expect(history.location.pathname).toBe('/fi/administration/keywords');
});

it('should render create keyword page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(`${ROUTES.CREATE_KEYWORD}`);
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: /lisää avainsana/i });
  });
  expect(history.location.pathname).toBe('/fi/administration/keywords/create');
});

it('should render edit keyword page', async () => {
  const id = keyword.id;
  await act(() => {
    const { history: newHistory } = renderRoute(
      `${ROUTES.EDIT_KEYWORD.replace(':id', id)}`
    );
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: /muokkaa avainsanaa/i });
  });
  expect(history.location.pathname).toBe(
    `/fi/administration/keywords/edit/${id}`
  );
});

it('should render keyword sets page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(`${ROUTES.KEYWORD_SETS}`);
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: /avainsanaryhmät/i });
  });
  expect(history.location.pathname).toBe('/fi/administration/keyword-sets');
});

it('should render create keyword set page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(`${ROUTES.CREATE_KEYWORD_SET}`);
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: /lisää avainsanaryhmä/i });
  });
  expect(history.location.pathname).toBe(
    '/fi/administration/keyword-sets/create'
  );
});

it('should render edit keyword set page', async () => {
  const id = keywordSet.id;
  await act(() => {
    const { history: newHistory } = renderRoute(
      `${ROUTES.EDIT_KEYWORD_SET.replace(':id', id)}`
    );
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: /muokkaa avainsanaryhmää/i });
  });
  expect(history.location.pathname).toBe(
    `/fi/administration/keyword-sets/edit/${id}`
  );
});

it('should render organizations page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(`${ROUTES.ORGANIZATIONS}`);
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: /organisaatiot/i });
  });
  expect(history.location.pathname).toBe('/fi/administration/organizations');
});

it('should render create organization page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(ROUTES.CREATE_ORGANIZATION);
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: /lisää organisaatio/i });
  });
  expect(history.location.pathname).toBe(
    `/fi/administration/organizations/create`
  );
});

it('should render edit organization page', async () => {
  const id = organizationId;
  await act(() => {
    const { history: newHistory } = renderRoute(
      `${ROUTES.EDIT_ORGANIZATION.replace(':id', id)}`
    );
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: /muokkaa organisaatiota/i });
  });
  expect(history.location.pathname).toBe(
    `/fi/administration/organizations/edit/${id}`
  );
});

it('should render places page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(`${ROUTES.PLACES}`);
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: /paikat/i });
  });
  expect(history.location.pathname).toBe('/fi/administration/places');
});

it('should render create place page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(ROUTES.CREATE_PLACE);
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: /lisää paikka/i });
  });
  expect(history.location.pathname).toBe(`/fi/administration/places/create`);
});

it('should render edit place page', async () => {
  const id = place.id;
  await act(() => {
    const { history: newHistory } = renderRoute(
      `${ROUTES.EDIT_PLACE.replace(':id', id)}`
    );
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: /muokkaa paikkaa/i });
  });
  expect(history.location.pathname).toBe(
    `/fi/administration/places/edit/${id}`
  );
});

it('should route to default help page', async () => {
  await act(() => {
    const { history: newHistory } = renderRoute(ROUTES.HELP);
    history = newHistory;
  });

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/help/instructions/general')
  );
});
