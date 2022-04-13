/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import TestController, { ClientFunction } from 'testcafe';

import {
  EventFieldsFragment,
  KeywordFieldsFragment,
  KeywordSetFieldsFragment,
  OrganizationFieldsFragment,
  PlaceFieldsFragment,
} from '../../src/generated/graphql';
import { getCommonComponents } from '../common.components';
import { getEnvUrl } from './settings';
import { getErrorMessage, setDataToPrintOnFailure } from './testcafe.utils';

const getPathname = ClientFunction(() => document.location.pathname);
const getPageTitle = ClientFunction(() => document.title);

export const getUrlUtils = (t: TestController) => {
  const pageIsLoaded = async () => {
    await getCommonComponents(t).loadingSpinner().expectations.isNotPresent();
  };

  const actions = {
    async navigateToEventsPage() {
      await t.navigateTo(getEnvUrl(`/fi/events`));
    },
    async navigateToLandingPage() {
      await t.navigateTo(getEnvUrl(`/fi`));
    },
    async navigateToKeywordsUrl(searchString: string) {
      const url = getEnvUrl(
        `/fi/admin/keywords?text=${encodeURIComponent(searchString)}`
      );
      setDataToPrintOnFailure(t, 'url', url);
      await t.navigateTo(url);
    },
    async navigateToKeywordSetsUrl(searchString: string) {
      const url = getEnvUrl(
        `/fi/admin/keyword-sets?text=${encodeURIComponent(searchString)}`
      );
      setDataToPrintOnFailure(t, 'url', url);
      await t.navigateTo(url);
    },
    async navigateToOrganizationsUrl(searchString: string) {
      const url = getEnvUrl(
        `/fi/admin/organizations?text=${encodeURIComponent(searchString)}`
      );
      setDataToPrintOnFailure(t, 'url', url);
      await t.navigateTo(url);
    },
    async navigateToPlacesUrl(searchString: string) {
      const url = getEnvUrl(
        `/fi/admin/places?text=${encodeURIComponent(searchString)}`
      );
      setDataToPrintOnFailure(t, 'url', url);
      await t.navigateTo(url);
    },
    async navigateToSearchUrl(searchString: string) {
      const url = getEnvUrl(
        `/fi/search?text=${encodeURIComponent(searchString)}`
      );
      setDataToPrintOnFailure(t, 'url', url);
      await t.navigateTo(url);
    },
    async navigateToSupportPage() {
      await t.navigateTo(getEnvUrl(`/fi/help`));
    },
  };

  const expectations = {
    async urlChangedToApiPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/technology/api`, await getErrorMessage(t));
    },
    async urlChangedToContactPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/support/contact`, await getErrorMessage(t));
    },
    async urlChangedToControlPanelPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/instructions/control-panel`, await getErrorMessage(t));
    },
    async urlChangedToCreateEventPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/events/create`, await getErrorMessage(t));
    },
    async urlChangedToCreateKeywordPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/admin/keywords/create`, await getErrorMessage(t));
    },
    async urlChangedToCreateKeywordSetPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/admin/keyword-sets/create`, await getErrorMessage(t));
    },
    async urlChangedToCreatePlacePage() {
      await t
        .expect(getPathname())
        .eql(`/fi/admin/places/create`, await getErrorMessage(t));
    },
    async urlChangedToCreateOrganizationPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/admin/organizations/create`, await getErrorMessage(t));
    },
    async urlChangedToDocumentationPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/technology/documentation`, await getErrorMessage(t));
    },
    async urlChangedToEventPage(event: EventFieldsFragment) {
      setDataToPrintOnFailure(t, 'expectedEvent', event);
      await t
        .expect(getPathname())
        .eql(`/fi/events/edit/${event.id}`, await getErrorMessage(t));
      await pageIsLoaded();
      await t
        .expect(getPageTitle())
        .eql(`${event.name.fi} - Linked Events`, await getErrorMessage(t));
    },
    async urlChangedToEventsPage() {
      await t.expect(getPathname()).eql(`/fi/events`, await getErrorMessage(t));
    },
    async urlChangedToEventSearchPage() {
      await t.expect(getPathname()).eql(`/fi/search`, await getErrorMessage(t));
    },
    async urlChangedToFaqPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/instructions/faq`, await getErrorMessage(t));
    },
    async urlChangedToFeaturesPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/features`, await getErrorMessage(t));
    },
    async urlChangedToImageRightsPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/technology/image-rights`, await getErrorMessage(t));
    },
    async urlChangedToKeywordPage(keyword: KeywordFieldsFragment) {
      setDataToPrintOnFailure(t, 'expectedKeyword', keyword);
      await t
        .expect(getPathname())
        .eql(`/fi/admin/keywords/edit/${keyword.id}`, await getErrorMessage(t));
      await pageIsLoaded();
      await t
        .expect(getPageTitle())
        .eql(`Muokkaa avainsanaa - Linked Events`, await getErrorMessage(t));
    },
    async urlChangedToKeywordSetPage(keywordSet: KeywordSetFieldsFragment) {
      setDataToPrintOnFailure(t, 'expectedKeywordSet', keywordSet);
      await t
        .expect(getPathname())
        .eql(
          `/fi/admin/keyword-sets/edit/${keywordSet.id}`,
          await getErrorMessage(t)
        );
      await pageIsLoaded();
      await t
        .expect(getPageTitle())
        .eql(
          `Muokkaa avainsanaryhmää - Linked Events`,
          await getErrorMessage(t)
        );
    },
    async urlChangedToKeywordsPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/admin/keywords`, await getErrorMessage(t));
    },
    async urlChangedToLandingPage() {
      await t.expect(getPathname()).eql(`/fi`, await getErrorMessage(t));
    },
    async urlChangedToOrganizationPage(
      organization: OrganizationFieldsFragment
    ) {
      setDataToPrintOnFailure(t, 'expectedOrganization', organization);
      await t
        .expect(getPathname())
        .eql(
          `/fi/admin/organizations/edit/${organization.id}`,
          await getErrorMessage(t)
        );
      await pageIsLoaded();
      await t
        .expect(getPageTitle())
        .eql(
          `Muokkaa organisaatiota - Linked Events`,
          await getErrorMessage(t)
        );
    },
    async urlChangedToPlacePage(place: PlaceFieldsFragment) {
      setDataToPrintOnFailure(t, 'expectedPlace', place);
      await t
        .expect(getPathname())
        .eql(`/fi/admin/places/edit/${place.id}`, await getErrorMessage(t));
      await pageIsLoaded();
      await t
        .expect(getPageTitle())
        .eql(`Muokkaa paikkaa - Linked Events`, await getErrorMessage(t));
    },
    async urlChangedToPlatformPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/instructions/platform`, await getErrorMessage(t));
    },
    async urlChangedToRegistrationsPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/registrations`, await getErrorMessage(t));
    },
    async urlChangedToSourceCodePage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/technology/source-code`, await getErrorMessage(t));
    },
    async urlChangedToSupportPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/instructions/general`, await getErrorMessage(t));
    },
    async urlChangedToTechnologyGeneralPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/technology/general`, await getErrorMessage(t));
    },
    async urlChangedToTermsOfUsePage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/support/terms-of-use`, await getErrorMessage(t));
    },
  };

  return {
    actions,
    expectations,
  };
};
