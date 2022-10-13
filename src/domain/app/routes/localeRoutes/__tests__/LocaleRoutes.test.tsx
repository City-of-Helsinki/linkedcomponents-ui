import { History } from 'history';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { DEPRECATED_ROUTES, ROUTES } from '../../../../../constants';
import { setFeatureFlags } from '../../../../../test/featureFlags/featureFlags';
import { Language } from '../../../../../types';
import { fakeAuthenticatedAuthContextValue } from '../../../../../utils/mockAuthContextValue';
import {
  act,
  configure,
  CustomRenderResult,
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
import { TEST_EVENT_ID } from '../../../../event/constants';
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

const authContextValue = fakeAuthenticatedAuthContextValue();

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

const renderRoute = async (route: string, locale: Language = 'fi') => {
  let result: CustomRenderResult | null = null;

  await act(async () => {
    result = await render(
      <Routes>
        <Route path={`/:locale/*`} element={<LocaleRoutes />} />
      </Routes>,
      { authContextValue, mocks, routes: [`/${locale}${route}`] }
    );
  });

  return result as unknown as CustomRenderResult;
};
const isPageRendered = async ({
  history,
  pageTitle,
  pathname,
}: {
  history: History;
  pageTitle: string;
  pathname: string;
}) => {
  await loadingSpinnerIsNotInDocument();
  await waitFor(() => expect(history.location.pathname).toBe(pathname));
  await waitFor(() => expect(document.title).toBe(pageTitle));
};

const isHeadingRendered = async (heading: string | RegExp) => {
  await loadingSpinnerIsNotInDocument();
  await act(async () => {
    await screen.findByRole('heading', { name: heading });
  });
};

beforeEach(() => {
  setFeatureFlags({ SHOW_ADMIN: true, SHOW_REGISTRATION: true });
});

it('should redirect to terms of use page from deprecated terms page', async () => {
  const { history } = await renderRoute(DEPRECATED_ROUTES.TERMS);

  await isPageRendered({
    history,
    pageTitle: `Käyttöehdot - Linked Events`,
    pathname: '/fi/help/support/terms-of-use',
  });
});

it('should render event search page', async () => {
  const { history } = await renderRoute(`${ROUTES.SEARCH}?text=${searchText}`);

  await isPageRendered({
    history,
    pageTitle: `Etsi tapahtumia - Linked Events`,
    pathname: '/fi/search',
  });
});

it.each([DEPRECATED_ROUTES.MODERATION, ROUTES.EVENTS])(
  'should render events page, route %p',
  async (route) => {
    const { history } = await renderRoute(`${route}?text=${searchText}`);

    await isPageRendered({
      history,
      pageTitle: `Omat tapahtumat - Linked Events`,
      pathname: '/fi/events',
    });
  }
);

it.each([DEPRECATED_ROUTES.CREATE_EVENT, ROUTES.CREATE_EVENT])(
  'should render create event page, route %p',
  async (route) => {
    const { history } = await renderRoute(route);

    await isPageRendered({
      history,
      pageTitle: `Uusi tapahtuma - Linked Events`,
      pathname: `/fi/events/create`,
    });
  }
);

it.each([
  DEPRECATED_ROUTES.UPDATE_EVENT.replace(':id', TEST_EVENT_ID),
  DEPRECATED_ROUTES.VIEW_EVENT.replace(':id', TEST_EVENT_ID),
  ROUTES.EDIT_EVENT.replace(':id', TEST_EVENT_ID),
])('should render edit event page, route %p', async (route) => {
  const { history } = await renderRoute(route);

  await isHeadingRendered(eventName);
  await isPageRendered({
    history,
    pageTitle: `${eventName} - Linked Events`,
    pathname: `/fi/events/edit/${TEST_EVENT_ID}`,
  });
});

it('should render registrations page', async () => {
  const { history } = await renderRoute(
    `${ROUTES.REGISTRATIONS}?text=${searchText}`
  );

  await isPageRendered({
    history,
    pageTitle: `Ilmoittautuminen - Linked Events`,
    pathname: '/fi/registrations',
  });
});

it('should render create registration page', async () => {
  const { history } = await renderRoute(`${ROUTES.CREATE_REGISTRATION}`);

  await isPageRendered({
    history,
    pageTitle: `Uusi ilmoittautuminen - Linked Events`,
    pathname: '/fi/registrations/create',
  });
});

it('should render edit registration page', async () => {
  const { history } = await renderRoute(
    `${ROUTES.EDIT_REGISTRATION.replace(':id', registrationId)}`
  );

  await isPageRendered({
    history,
    pageTitle: `Muokkaa ilmoittautumista - Linked Events`,
    pathname: `/fi/registrations/edit/${registrationId}`,
  });
});

it('should render registration enrolments page', async () => {
  const { history } = await renderRoute(
    `${ROUTES.REGISTRATION_ENROLMENTS.replace(
      ':registrationId',
      registrationId
    )}`
  );

  await isPageRendered({
    history,
    pageTitle: `Ilmoittautuneet: ${eventName} - Linked Events`,
    pathname: `/fi/registrations/${registrationId}/enrolments`,
  });
});

it('should render create enrolment page', async () => {
  const { history } = await renderRoute(
    `${ROUTES.CREATE_ENROLMENT.replace(':registrationId', registrationId)}`
  );

  await isPageRendered({
    history,
    pageTitle: 'Lisää osallistuja - Linked Events',
    pathname: `/fi/registrations/${registrationId}/enrolments/create`,
  });
});

it('should render edit enrolment page', async () => {
  const { history } = await renderRoute(
    `${ROUTES.EDIT_REGISTRATION_ENROLMENT.replace(
      ':registrationId',
      registrationId
    ).replace(':enrolmentId', enrolmentId)}`
  );

  await isPageRendered({
    history,
    pageTitle: 'Muokkaa osallistujaa - Linked Events',
    pathname: `/fi/registrations/${registrationId}/enrolments/edit/${enrolmentId}`,
  });
});

it('should render images page', async () => {
  const { history } = await renderRoute(`${ROUTES.IMAGES}`);

  await isPageRendered({
    history,
    pageTitle: 'Kuvat - Linked Events',
    pathname: '/fi/administration/images',
  });
});

it('should render create image page', async () => {
  const { history } = await renderRoute(`${ROUTES.CREATE_IMAGE}`);

  await isHeadingRendered(/lisää kuva/i);
  await isPageRendered({
    history,
    pageTitle: 'Lisää kuva - Linked Events',
    pathname: '/fi/administration/images/create',
  });
});

it('should render edit image page', async () => {
  const id = image.id as string;
  const { history } = await renderRoute(
    `${ROUTES.EDIT_IMAGE.replace(':id', id)}`
  );

  await isHeadingRendered(/muokkaa kuvaa/i);
  await isPageRendered({
    history,
    pageTitle: 'Muokkaa kuvaa - Linked Events',
    pathname: `/fi/administration/images/edit/${id}`,
  });
});

it('should render keywords page', async () => {
  const { history } = await renderRoute(`${ROUTES.KEYWORDS}`);

  await isPageRendered({
    history,
    pageTitle: 'Avainsanat - Linked Events',
    pathname: '/fi/administration/keywords',
  });
});

it('should render create keyword page', async () => {
  const { history } = await renderRoute(`${ROUTES.CREATE_KEYWORD}`);

  await isPageRendered({
    history,
    pageTitle: 'Lisää avainsana - Linked Events',
    pathname: '/fi/administration/keywords/create',
  });
});

it('should render edit keyword page', async () => {
  const id = keyword.id as string;
  const { history } = await renderRoute(
    `${ROUTES.EDIT_KEYWORD.replace(':id', id)}`
  );

  await isPageRendered({
    history,
    pageTitle: 'Muokkaa avainsanaa - Linked Events',
    pathname: `/fi/administration/keywords/edit/${id}`,
  });
});

it('should render keyword sets page', async () => {
  const { history } = await renderRoute(`${ROUTES.KEYWORD_SETS}`);

  await isPageRendered({
    history,
    pageTitle: 'Avainsanaryhmät - Linked Events',
    pathname: '/fi/administration/keyword-sets',
  });
});

it('should render create keyword set page', async () => {
  const { history } = await renderRoute(`${ROUTES.CREATE_KEYWORD_SET}`);

  await isPageRendered({
    history,
    pageTitle: 'Lisää avainsanaryhmä - Linked Events',
    pathname: '/fi/administration/keyword-sets/create',
  });
});

it('should render edit keyword set page', async () => {
  const id = keywordSet.id as string;
  const { history } = await renderRoute(
    `${ROUTES.EDIT_KEYWORD_SET.replace(':id', id)}`
  );

  await isPageRendered({
    history,
    pageTitle: 'Muokkaa avainsanaryhmää - Linked Events',
    pathname: `/fi/administration/keyword-sets/edit/${id}`,
  });
});

it('should render organizations page', async () => {
  const { history } = await renderRoute(`${ROUTES.ORGANIZATIONS}`);

  await isPageRendered({
    history,
    pageTitle: 'Organisaatiot - Linked Events',
    pathname: '/fi/administration/organizations',
  });
});

it('should render create organization page', async () => {
  const { history } = await renderRoute(ROUTES.CREATE_ORGANIZATION);

  await isPageRendered({
    history,
    pageTitle: 'Lisää organisaatio - Linked Events',
    pathname: '/fi/administration/organizations/create',
  });
});

it('should render edit organization page', async () => {
  const id = organizationId;
  const { history } = await renderRoute(
    `${ROUTES.EDIT_ORGANIZATION.replace(':id', id)}`
  );

  await isPageRendered({
    history,
    pageTitle: 'Muokkaa organisaatiota - Linked Events',
    pathname: `/fi/administration/organizations/edit/${id}`,
  });
});

it('should render places page', async () => {
  const { history } = await renderRoute(`${ROUTES.PLACES}`);

  await isPageRendered({
    history,
    pageTitle: 'Paikat - Linked Events',
    pathname: '/fi/administration/places',
  });
});

it('should render create place page', async () => {
  const { history } = await renderRoute(ROUTES.CREATE_PLACE);

  await isPageRendered({
    history,
    pageTitle: 'Lisää paikka - Linked Events',
    pathname: '/fi/administration/places/create',
  });
});

it('should render edit place page', async () => {
  const id = place.id as string;
  const { history } = await renderRoute(
    `${ROUTES.EDIT_PLACE.replace(':id', id)}`
  );

  await isPageRendered({
    history,
    pageTitle: 'Muokkaa paikkaa - Linked Events',
    pathname: `/fi/administration/places/edit/${id}`,
  });
});

it('should route to default help page', async () => {
  const { history } = await renderRoute(ROUTES.HELP);

  await isPageRendered({
    history,
    pageTitle: 'Tuki - Linked Events',
    pathname: '/fi/help/instructions/general',
  });
});