/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import TestController from 'testcafe';

import {
  EventFieldsFragment,
  OrganizationFieldsFragment,
  PlaceFieldsFragment,
} from '../../src/generated/graphql';
import getValue from '../../src/utils/getValue';
import { getCommonComponents } from '../common.components';
import { getExpectedEventContext } from '../utils/event.utils';
import {
  getErrorMessage,
  screenContext,
  setDataToPrintOnFailure,
  withinContext,
} from '../utils/testcafe.utils';

export const getEventSearchPage = (t: TestController) => {
  const within = withinContext(t);
  const screen = screenContext(t);

  const pageIsLoaded = async () =>
    await getCommonComponents(t)
      .loadingSpinner()
      .expectations.isNotPresent({ timeout: 20000 });

  const findSearchBanner = async () => {
    await t
      .expect(screen.findByTestId('event-search-panel').exists)
      .ok(await getErrorMessage(t));

    const withinSearchBanner = () =>
      within(screen.getByTestId('event-search-panel'));

    const selectors = {
      clearFiltersButton() {
        return withinSearchBanner().findByRole('button', {
          name: 'Tyhjennä hakuehdot',
        });
      },
      placeCheckbox(place: PlaceFieldsFragment) {
        return withinSearchBanner().findAllByRole('checkbox', {
          name: getValue(place.name?.fi, ''),
        });
      },
      placeFilter() {
        return withinSearchBanner().findByRole('button', {
          name: /etsi tapahtumapaikkaa/i,
        });
      },
      placeSearchInput() {
        return withinSearchBanner().findByRole('textbox', { name: 'Hae' });
      },
      searchInput() {
        return withinSearchBanner().findByPlaceholderText('Hae tapahtumia');
      },
    };

    const actions = {
      async clickClearFiltersButton() {
        await t.click(selectors.clearFiltersButton());
      },
      async inputSearchTextAndPressEnter(searchString: string) {
        setDataToPrintOnFailure(t, 'typeText', searchString);
        await t
          .typeText(selectors.searchInput(), searchString)
          .pressKey('enter');
      },
      async openPlaceFilters() {
        await t.click(selectors.placeFilter());
      },

      async selectPlaceFilter(place: PlaceFieldsFragment) {
        setDataToPrintOnFailure(t, 'typeText', getValue(place.name?.fi, ''));
        await t
          .click(selectors.placeSearchInput())
          .pressKey('ctrl+a delete') // clears previous input
          .typeText(selectors.placeSearchInput(), getValue(place.name?.fi, ''))
          .click(selectors.placeCheckbox(place));
      },
    };

    return { actions };
  };

  const findSearchResultList = async () => {
    await t
      .expect(screen.findByTestId('event-result-list').exists)
      .ok(await getErrorMessage(t));

    const withinSearchResultList = () =>
      within(screen.getByTestId('event-result-list'));

    const expectations = {
      async allEventCardsAreVisible(events: EventFieldsFragment[]) {
        for (const e of events) {
          await eventCard(e);
        }
      },
    };

    const eventCard = async (
      event: EventFieldsFragment,
      searchedField?: keyof EventFieldsFragment
    ) => {
      setDataToPrintOnFailure(
        t,
        'expectedEvent',
        getExpectedEventContext(event)
      );

      const eventCard = () => {
        return withinSearchResultList().getAllByTestId(event.id);
      };

      const withinEventCard = () => within(eventCard().nth(0));

      if (searchedField) {
        setDataToPrintOnFailure(
          t,
          'expectedEvent',
          getExpectedEventContext(event, searchedField)
        );
      }
      await pageIsLoaded();
      await t.expect(eventCard().count).gt(0, await getErrorMessage(t));

      const selectors = {
        addressText(location: PlaceFieldsFragment) {
          const locationName = location.name?.fi ?? '';
          const streetAddress = location.streetAddress?.fi ?? '';
          const addressLocality = location.addressLocality?.fi ?? '';

          return withinEventCard().findAllByText(
            [locationName, streetAddress, addressLocality]
              .filter((i) => i)
              .join(', ')
          );
        },
        eventLink() {
          return withinEventCard().findByRole('link', {
            name: /siirry tapahtumasivulle/i,
          });
        },
        publisherText(publisher: OrganizationFieldsFragment) {
          return withinEventCard().findByText(getValue(publisher.name, ''));
        },
        containsText(text: string) {
          return withinEventCard().findByText(RegExp(text, 'gi'));
        },
      };

      const expectations = {
        async addressIsPresent(location: PlaceFieldsFragment) {
          await t
            .expect(selectors.addressText(location).exists)
            .ok(await getErrorMessage(t));
        },
        async publisherIsPresent(publisher: OrganizationFieldsFragment) {
          await t
            .expect(selectors.publisherText(publisher).exists)
            .ok(await getErrorMessage(t));
        },
      };

      const actions = {
        async clickEventLink() {
          await t.click(selectors.eventLink());
        },
      };

      return {
        expectations,
        actions,
      };
    };

    return {
      eventCard,
      expectations,
    };
  };

  return { findSearchBanner, findSearchResultList, pageIsLoaded };
};
