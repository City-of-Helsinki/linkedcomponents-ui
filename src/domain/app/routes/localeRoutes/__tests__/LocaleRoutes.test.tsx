/* eslint-disable max-len */
import { MockedResponse } from '@apollo/client/testing';
import { History } from 'history';
import React from 'react';
import { Route, Routes } from 'react-router';

import { mockedRegistrationEventSelectorEventsResponse } from '../../../../../common/components/formFields/registrationEventSelectorField/__mocks__/registrationEventSelectorField';
import { mockedKeywordsResponse as mockedKeywordSelectorKeywordsResponse } from '../../../../../common/components/keywordSelector/__mocks__/keywordSelector';
import { mockedPlacesResponse as mockedPlaceSelectorPlacesResponse } from '../../../../../common/components/placeSelector/__mocks__/placeSelector';
import { DEPRECATED_ROUTES, ROUTES } from '../../../../../constants';
import { AttendeeStatus } from '../../../../../generated/graphql';
import { setFeatureFlags } from '../../../../../test/featureFlags/featureFlags';
import { Language } from '../../../../../types';
import getValue from '../../../../../utils/getValue';
import { fakeSignups } from '../../../../../utils/mockDataUtils';
import { mockAuthenticatedLoginState } from '../../../../../utils/mockLoginHooks';
import {
  actWait,
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  waitFor,
} from '../../../../../utils/testUtils';
import { mockedRegistrationResponse as mockedAttendanceListRegistrationResponse } from '../../../../attendanceList/__mocks__/attendanceListPage';
import { mockedDataSourceResponse } from '../../../../dataSource/__mocks__/dataSource';
import {
  eventName,
  mockedEventResponse,
} from '../../../../event/__mocks__/event';
import { TEST_EVENT_ID } from '../../../../event/constants';
import {
  mockedBaseDraftEventsResponse,
  mockedBaseOwnPublishedEventsResponse,
  mockedBasePublicEventsResponse,
  mockedBaseWaitingApprovalEventsResponse,
  mockedDraftEventsResponse,
  mockedOwnPublishedEventsResponse,
  mockedWaitingApprovalEventsResponse,
} from '../../../../events/__mocks__/eventsPage';
import {
  mockedEventsResponse,
  mockedPlacesResponse as mockedEventSearchPlacesResponse,
  searchText,
} from '../../../../eventSearch/__mocks__/eventSearchPage';
import { image, mockedImageResponse } from '../../../../image/__mocks__/image';
import { mockedImagesResponse } from '../../../../images/__mocks__/imagesPage';
import {
  keyword,
  mockedKeywordResponse,
  mockedKeywordsResponse as mockedEditKeywordKeywordsResponse,
} from '../../../../keyword/__mocks__/editKeywordPage';
import { mockedKeywordsResponse } from '../../../../keywords/__mocks__/keywordsPage';
import {
  keywordSet,
  mockedKeywordSetResponse,
} from '../../../../keywordSet/__mocks__/editKeywordSetPage';
import {
  mockedAudienceKeywordSetResponse,
  mockedEducationLevelsKeywordSetResponse,
  mockedEducationModelsKeywordSetResponse,
  mockedTopicsKeywordSetResponse,
} from '../../../../keywordSet/__mocks__/keywordSets';
import { mockedKeywordSetsResponse } from '../../../../keywordSets/__mocks__/keywordSetsPage';
import {
  mockedLanguagesResponse,
  mockedServiceLanguagesResponse,
} from '../../../../language/__mocks__/language';
import {
  mockedOrganizationResponse,
  organizationId,
} from '../../../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../../../organization/__mocks__/organizationAncestors';
import {
  mockedOrganizationClassesResponse,
  mockedOrganizationClassResponse,
} from '../../../../organizationClass/__mocks__/organizationClass';
import { mockedOrganizationsResponse } from '../../../../organizations/__mocks__/organizationsPage';
import {
  mockedPlaceResponse,
  place,
} from '../../../../place/__mocks__/editPlacePage';
import { mockedPlacesResponse } from '../../../../places/__mocks__/placesPage';
import {
  mockedPriceGroupResponse,
  priceGroup,
} from '../../../../priceGroup/__mocks__/editPriceGoupPage';
import {
  mockedDefaultPriceGroupsResponse,
  mockedPublisherPriceGroupsResponse,
} from '../../../../priceGroup/__mocks__/priceGroups';
import { mockedPriceGroupsResponse } from '../../../../priceGroups/__mocks__/priceGroupsPage';
import {
  mockedRegistrationResponse,
  registrationId,
} from '../../../../registration/__mocks__/editRegistrationPage';
import { TEST_REGISTRATION_ID } from '../../../../registration/constants';
import { mockedRegistrationsResponse } from '../../../../registrations/__mocks__/registrationsPage';
import {
  mockedSignupResponse,
  signupId,
} from '../../../../signup/__mocks__/editSignupPage';
import {
  mockedSignupGroupResponse,
  signupGroupId,
} from '../../../../signupGroup/__mocks__/editSignupGroupPage';
import { getMockedAttendeesResponse } from '../../../../signups/__mocks__/signupsPage';
import {
  mockedSuperuserResponse,
  mockedUsersResponse,
} from '../../../../user/__mocks__/user';
import LocaleRoutes from '../LocaleRoutes';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const renderRoute = ({
  locale = 'fi',
  mocks = [],
  route,
}: {
  route: string;
  locale?: Language;
  mocks?: MockedResponse[];
}) =>
  render(
    <Routes>
      <Route path={`/:locale/*`} element={<LocaleRoutes />} />
    </Routes>,
    { mocks, routes: [`/${locale}${route}`] }
  );

const isPageRendered = async ({
  history,
  pageTitle,
  pathname,
}: {
  history: History;
  pageTitle: string;
  pathname: string;
}) => {
  await loadingSpinnerIsNotInDocument(10000);
  await waitFor(() => expect(history.location.pathname).toBe(pathname));
  await waitFor(() => expect(document.title).toBe(pageTitle), {
    timeout: 20000,
  });
};

const isHeadingRendered = async (heading: string | RegExp) => {
  await loadingSpinnerIsNotInDocument(10000);
  await screen.findByRole('heading', { name: heading }, { timeout: 5000 });
};

beforeEach(() => {
  setFeatureFlags({
    SHOW_ADMIN: true,
    SHOW_PLACE_PAGES: true,
    SWEDISH_TRANSLATIONS: true,
    WEB_STORE_INTEGRATION: true,
  });
});

it('should redirect to terms of use page from deprecated terms page', async () => {
  const { history } = renderRoute({
    mocks: [mockedSuperuserResponse],
    route: DEPRECATED_ROUTES.TERMS,
  });

  await isPageRendered({
    history,
    pageTitle: `Tietosuoja ja käyttöehdot - Linked Events`,
    pathname: '/fi/help/support/terms-of-use',
  });
});

it('should render event search page', async () => {
  const { history } = renderRoute({
    mocks: [mockedEventSearchPlacesResponse, mockedSuperuserResponse],
    route: `${ROUTES.SEARCH}?text=${searchText}`,
  });

  await isPageRendered({
    history,
    pageTitle: `Etsi tapahtumia - Linked Events`,
    pathname: '/fi/search',
  });
});

it.each([DEPRECATED_ROUTES.MODERATION, ROUTES.EVENTS])(
  'should render events page, route %p',
  async (route) => {
    const { history } = renderRoute({
      mocks: [
        mockedBaseDraftEventsResponse,
        mockedBaseWaitingApprovalEventsResponse,
        mockedBasePublicEventsResponse,
        mockedBaseOwnPublishedEventsResponse,
        mockedDraftEventsResponse,
        mockedWaitingApprovalEventsResponse,
        mockedEventsResponse,
        mockedOwnPublishedEventsResponse,
        mockedSuperuserResponse,
        mockedOrganizationAncestorsResponse,
        mockedOrganizationResponse,
      ],
      route: `${route}`,
    });

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
    const { history } = renderRoute({
      mocks: [
        mockedKeywordSelectorKeywordsResponse,
        mockedTopicsKeywordSetResponse,
        mockedAudienceKeywordSetResponse,
        mockedEducationLevelsKeywordSetResponse,
        mockedEducationModelsKeywordSetResponse,
        mockedLanguagesResponse,
        mockedOrganizationResponse,
        mockedPlaceSelectorPlacesResponse,
        mockedPublisherPriceGroupsResponse,
        mockedSuperuserResponse,
      ],
      route,
    });

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
  const { history } = renderRoute({
    mocks: [
      mockedEventResponse,
      mockedImageResponse,
      mockedPlaceResponse,
      mockedKeywordSelectorKeywordsResponse,
      mockedTopicsKeywordSetResponse,
      mockedAudienceKeywordSetResponse,
      mockedEducationLevelsKeywordSetResponse,
      mockedEducationModelsKeywordSetResponse,
      mockedLanguagesResponse,
      mockedOrganizationResponse,
      mockedPlaceSelectorPlacesResponse,
      mockedPublisherPriceGroupsResponse,
      mockedSuperuserResponse,
      mockedOrganizationAncestorsResponse,
    ],
    route,
  });

  await isHeadingRendered(eventName);
  await actWait(100);

  await isPageRendered({
    history,
    pageTitle: `${eventName} - Linked Events`,
    pathname: `/fi/events/edit/${TEST_EVENT_ID}`,
  });
  await actWait(100);
});

it('should render accessibility statement page', async () => {
  const { history } = renderRoute({
    mocks: [mockedSuperuserResponse],
    route: `${ROUTES.ACCESSIBILITY_STATEMENT}`,
  });

  await isPageRendered({
    history,
    pageTitle: `Saavutettavuusseloste - Linked Events`,
    pathname: '/fi/accessibility-statement',
  });
});

it('should render registrations page', async () => {
  const { history } = renderRoute({
    mocks: [
      mockedOrganizationResponse,
      mockedOrganizationAncestorsResponse,
      mockedRegistrationsResponse,
      mockedSuperuserResponse,
    ],
    route: `${ROUTES.REGISTRATIONS}`,
  });

  await isPageRendered({
    history,
    pageTitle: `Ilmoittautuminen - Linked Events`,
    pathname: '/fi/registrations',
  });
});

it('should render create registration page', async () => {
  const { history } = renderRoute({
    mocks: [
      mockedRegistrationEventSelectorEventsResponse,
      mockedDefaultPriceGroupsResponse,
      mockedSuperuserResponse,
    ],
    route: `${ROUTES.CREATE_REGISTRATION}`,
  });

  await isPageRendered({
    history,
    pageTitle: `Uusi ilmoittautuminen - Linked Events`,
    pathname: '/fi/registrations/create',
  });
});

it('should render registration saved page', async () => {
  const { history } = renderRoute({
    mocks: [mockedRegistrationResponse, mockedSuperuserResponse],
    route: `${ROUTES.REGISTRATION_SAVED.replace(':id', TEST_REGISTRATION_ID)}`,
  });

  await isPageRendered({
    history,
    pageTitle: `Ilmoittautuminen tallennettu - Linked Events`,
    pathname: `/fi/registrations/completed/${registrationId}`,
  });
});

it('should render edit registration page', async () => {
  const { history } = renderRoute({
    mocks: [
      mockedRegistrationResponse,
      mockedSuperuserResponse,
      mockedOrganizationAncestorsResponse,
      mockedPublisherPriceGroupsResponse,
    ],
    route: `${ROUTES.EDIT_REGISTRATION.replace(':id', registrationId)}`,
  });

  await isPageRendered({
    history,
    pageTitle: `Muokkaa ilmoittautumista - Linked Events`,
    pathname: `/fi/registrations/edit/${registrationId}`,
  });
});

it('should render attendance list page', async () => {
  const { history } = renderRoute({
    mocks: [
      mockedAttendanceListRegistrationResponse,
      mockedOrganizationAncestorsResponse,
      mockedSuperuserResponse,
    ],
    route: `${ROUTES.ATTENDANCE_LIST.replace(':registrationId', registrationId)}`,
  });

  await isPageRendered({
    history,
    pageTitle: `Osallistujalista: ${eventName} - Linked Events`,
    pathname: `/fi/registrations/${registrationId}/attendance-list`,
  });
});

it('should render registration signups page', async () => {
  const { history } = renderRoute({
    mocks: [
      mockedOrganizationAncestorsResponse,
      mockedRegistrationResponse,
      mockedSuperuserResponse,
      getMockedAttendeesResponse({ signupsResponse: fakeSignups(0) }),
      getMockedAttendeesResponse({
        signupsResponse: fakeSignups(0),
        overrideVariables: {
          attendeeStatus: AttendeeStatus.Waitlisted,
        },
      }),
    ],
    route: `${ROUTES.REGISTRATION_SIGNUPS.replace(':registrationId', registrationId)}`,
  });

  await isPageRendered({
    history,
    pageTitle: `Ilmoittautuneet: ${eventName} - Linked Events`,
    pathname: `/fi/registrations/${registrationId}/signups`,
  });
});

it('should render create signup group page', async () => {
  const { history } = renderRoute({
    mocks: [mockedRegistrationResponse, mockedSuperuserResponse],
    route: `${ROUTES.CREATE_SIGNUP_GROUP.replace(':registrationId', registrationId)}`,
  });

  await isPageRendered({
    history,
    pageTitle: 'Lisää osallistujia - Linked Events',
    pathname: `/fi/registrations/${registrationId}/signup-group/create`,
  });
});

it('should render edit signup group page', async () => {
  const { history } = renderRoute({
    mocks: [
      mockedRegistrationResponse,
      mockedSignupGroupResponse,
      mockedLanguagesResponse,
      mockedServiceLanguagesResponse,
      mockedSuperuserResponse,
      mockedOrganizationAncestorsResponse,
    ],
    route: `${ROUTES.EDIT_SIGNUP_GROUP.replace(
      ':registrationId',
      registrationId
    ).replace(':signupGroupId', signupGroupId)}`,
  });

  await isPageRendered({
    history,
    pageTitle: 'Muokkaa osallistujia - Linked Events',
    pathname: `/fi/registrations/${registrationId}/signup-group/edit/${signupGroupId}`,
  });
});

it('should render edit signup page', async () => {
  const { history } = renderRoute({
    mocks: [
      mockedRegistrationResponse,
      mockedSignupResponse,
      mockedLanguagesResponse,
      mockedServiceLanguagesResponse,
      mockedSuperuserResponse,
      mockedOrganizationAncestorsResponse,
    ],
    route: `${ROUTES.EDIT_SIGNUP.replace(
      ':registrationId',
      registrationId
    ).replace(':signupId', signupId)}`,
  });

  await isPageRendered({
    history,
    pageTitle: 'Muokkaa osallistujaa - Linked Events',
    pathname: `/fi/registrations/${registrationId}/signup/edit/${signupId}`,
  });
});

it('should render images page', async () => {
  const { history } = renderRoute({
    mocks: [
      mockedImagesResponse,
      mockedSuperuserResponse,
      mockedOrganizationAncestorsResponse,
    ],
    route: `${ROUTES.IMAGES}`,
  });

  await isPageRendered({
    history,
    pageTitle: 'Kuvat - Linked Events',
    pathname: '/fi/administration/images',
  });
});

it('should render create image page', async () => {
  const { history } = renderRoute({
    mocks: [
      mockedOrganizationResponse,
      mockedSuperuserResponse,
      mockedOrganizationAncestorsResponse,
    ],
    route: `${ROUTES.CREATE_IMAGE}`,
  });

  await isHeadingRendered(/lisää kuva/i);
  await isPageRendered({
    history,
    pageTitle: 'Lisää kuva - Linked Events',
    pathname: '/fi/administration/images/create',
  });
});

it('should render edit image page', async () => {
  const id = getValue(image.id, '');
  const { history } = renderRoute({
    mocks: [
      mockedImageResponse,
      mockedOrganizationResponse,
      mockedSuperuserResponse,
      mockedOrganizationAncestorsResponse,
    ],
    route: `${ROUTES.EDIT_IMAGE.replace(':id', id)}`,
  });

  await isHeadingRendered(/muokkaa kuvaa/i);
  await isPageRendered({
    history,
    pageTitle: 'Muokkaa kuvaa - Linked Events',
    pathname: `/fi/administration/images/edit/${id}`,
  });
});

it('should render keywords page', async () => {
  const { history } = renderRoute({
    mocks: [
      mockedKeywordsResponse,
      mockedSuperuserResponse,
      mockedOrganizationAncestorsResponse,
    ],
    route: `${ROUTES.KEYWORDS}`,
  });

  await isPageRendered({
    history,
    pageTitle: 'Avainsanat - Linked Events',
    pathname: '/fi/administration/keywords',
  });
});

it('should render edit keyword page', async () => {
  const id = getValue(keyword.id, '');
  const { history } = renderRoute({
    mocks: [
      mockedKeywordResponse,
      mockedOrganizationResponse,
      mockedEditKeywordKeywordsResponse,
      mockedSuperuserResponse,
      mockedOrganizationAncestorsResponse,
    ],
    route: `${ROUTES.EDIT_KEYWORD.replace(':id', id)}`,
  });

  await isPageRendered({
    history,
    pageTitle: 'Muokkaa avainsanaa - Linked Events',
    pathname: `/fi/administration/keywords/edit/${id}`,
  });
});

it('should render keyword sets page', async () => {
  const { history } = renderRoute({
    mocks: [
      mockedKeywordSetsResponse,
      mockedSuperuserResponse,
      mockedOrganizationAncestorsResponse,
    ],
    route: `${ROUTES.KEYWORD_SETS}`,
  });

  await isPageRendered({
    history,
    pageTitle: 'Avainsanaryhmät - Linked Events',
    pathname: '/fi/administration/keyword-sets',
  });
});

it('should render edit keyword set page', async () => {
  const id = getValue(keywordSet.id, '');
  const { history } = renderRoute({
    mocks: [
      mockedKeywordSetResponse,
      mockedOrganizationResponse,
      mockedKeywordResponse,
      mockedKeywordSelectorKeywordsResponse,
      mockedSuperuserResponse,
      mockedOrganizationAncestorsResponse,
    ],
    route: `${ROUTES.EDIT_KEYWORD_SET.replace(':id', id)}`,
  });

  await isPageRendered({
    history,
    pageTitle: 'Muokkaa avainsanaryhmää - Linked Events',
    pathname: `/fi/administration/keyword-sets/edit/${id}`,
  });
});

it('should render organizations page', async () => {
  const { history } = renderRoute({
    mocks: [
      mockedDataSourceResponse,
      mockedOrganizationsResponse,
      mockedOrganizationClassResponse,
      mockedSuperuserResponse,
    ],
    route: `${ROUTES.ORGANIZATIONS}`,
  });

  await isPageRendered({
    history,
    pageTitle: 'Organisaatiot - Linked Events',
    pathname: '/fi/administration/organizations',
  });
});

it('should render create organization page', async () => {
  const { history } = renderRoute({
    mocks: [
      mockedOrganizationClassesResponse,
      mockedOrganizationsResponse,
      mockedSuperuserResponse,
      mockedUsersResponse,
    ],
    route: ROUTES.CREATE_ORGANIZATION,
  });

  await isPageRendered({
    history,
    pageTitle: 'Lisää organisaatio - Linked Events',
    pathname: '/fi/administration/organizations/create',
  });
});

it('should render edit organization page', async () => {
  const id = organizationId;
  const { history } = renderRoute({
    mocks: [
      mockedOrganizationResponse,
      mockedOrganizationsResponse,
      mockedOrganizationClassesResponse,
      mockedOrganizationClassResponse,
      mockedSuperuserResponse,
      mockedUsersResponse,
    ],
    route: `${ROUTES.EDIT_ORGANIZATION.replace(':id', id)}`,
  });

  await isPageRendered({
    history,
    pageTitle: 'Muokkaa organisaatiota - Linked Events',
    pathname: `/fi/administration/organizations/edit/${id}`,
  });
});

it('should render places page', async () => {
  const { history } = renderRoute({
    mocks: [
      mockedPlacesResponse,
      mockedSuperuserResponse,
      mockedOrganizationAncestorsResponse,
    ],
    route: `${ROUTES.PLACES}`,
  });

  await isPageRendered({
    history,
    pageTitle: 'Paikat - Linked Events',
    pathname: '/fi/administration/places',
  });
});

it('should render create place page', async () => {
  const { history } = renderRoute({
    mocks: [
      mockedOrganizationResponse,
      mockedSuperuserResponse,
      mockedOrganizationAncestorsResponse,
    ],
    route: ROUTES.CREATE_PLACE,
  });

  await isPageRendered({
    history,
    pageTitle: 'Lisää paikka - Linked Events',
    pathname: '/fi/administration/places/create',
  });
});

it('should render edit place page', async () => {
  const id = getValue(place.id, '');
  const { history } = renderRoute({
    mocks: [
      mockedPlaceResponse,
      mockedOrganizationResponse,
      mockedSuperuserResponse,
      mockedOrganizationAncestorsResponse,
    ],
    route: `${ROUTES.EDIT_PLACE.replace(':id', id)}`,
  });

  await isPageRendered({
    history,
    pageTitle: 'Muokkaa paikkaa - Linked Events',
    pathname: `/fi/administration/places/edit/${id}`,
  });
});

it('should render price groups page', async () => {
  const { history } = renderRoute({
    mocks: [
      mockedPriceGroupsResponse,
      mockedOrganizationResponse,
      mockedSuperuserResponse,
      mockedOrganizationAncestorsResponse,
    ],
    route: `${ROUTES.PRICE_GROUPS}`,
  });

  await isPageRendered({
    history,
    pageTitle: 'Asiakasryhmät - Linked Events',
    pathname: '/fi/administration/price-groups',
  });
});

it('should render create price group page', async () => {
  const { history } = renderRoute({
    mocks: [
      mockedOrganizationResponse,
      mockedSuperuserResponse,
      mockedOrganizationAncestorsResponse,
    ],
    route: ROUTES.CREATE_PRICE_GROUP,
  });

  await isPageRendered({
    history,
    pageTitle: 'Lisää asiakasryhmä - Linked Events',
    pathname: '/fi/administration/price-groups/create',
  });
});

it('should render edit price group page', async () => {
  const id = priceGroup.id.toString();
  const { history } = renderRoute({
    mocks: [
      mockedPriceGroupResponse,
      mockedOrganizationResponse,
      mockedSuperuserResponse,
      mockedOrganizationAncestorsResponse,
    ],
    route: `${ROUTES.EDIT_PRICE_GROUP.replace(':id', id)}`,
  });

  await isPageRendered({
    history,
    pageTitle: 'Muokkaa asiakasryhmää - Linked Events',
    pathname: `/fi/administration/price-groups/edit/${id}`,
  });
});

it('should route to default help page', async () => {
  const { history } = renderRoute({
    mocks: [mockedSuperuserResponse],
    route: ROUTES.HELP,
  });

  await isPageRendered({
    history,
    pageTitle: 'Tietoa palvelusta - Linked Events',
    pathname: '/fi/help/support/service-information',
  });
});
