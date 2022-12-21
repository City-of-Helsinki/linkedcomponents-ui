/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import TestController from 'testcafe';

import { PlaceFieldsFragment } from '../../src/generated/graphql';
import { getCommonComponents } from '../common.components';
import { getExpectedPlaceContext } from '../utils/place.utils';
import {
  getErrorMessage,
  screenContext,
  setDataToPrintOnFailure,
  withinContext,
} from '../utils/testcafe.utils';

export const getPlacesPage = async (t: TestController) => {
  const within = withinContext(t);
  const screen = screenContext(t);

  const pageIsLoaded = async () =>
    await getCommonComponents(t)
      .loadingSpinner()
      .expectations.isNotPresent({ timeout: 20000 });

  await t.expect(screen.findByRole('main').exists).ok(await getErrorMessage(t));

  const withinPlacesPage = () => {
    return within(screen.getByRole('main'));
  };

  const findSearchBanner = async () => {
    const selectors = {
      searchInput() {
        return withinPlacesPage().getByRole('combobox', {
          name: /hae paikkoja/i,
        });
      },
      searchButton() {
        return withinPlacesPage().getByRole('button', { name: /etsi/i });
      },
    };

    const actions = {
      async clickSearchButton() {
        await t.click(selectors.searchButton());
      },
      async inputSearchTextAndPressEnter(searchString: string) {
        setDataToPrintOnFailure(t, 'typeText', searchString);
        await t
          .typeText(selectors.searchInput(), searchString)
          .pressKey('enter');
      },
    };

    return { actions };
  };

  const findSearchResultList = async () => {
    await t
      .expect(screen.findByTestId('place-result-list').exists)
      .ok(await getErrorMessage(t));

    const withinSearchResultList = () =>
      within(screen.getByTestId('place-result-list'));

    const expectations = {
      async allPlaceRowsAreVisible(places: PlaceFieldsFragment[]) {
        for (const p of places) {
          await placeRow(p);
        }
      },
    };

    const placeRow = async (
      place: PlaceFieldsFragment,
      searchedField?: keyof PlaceFieldsFragment
    ) => {
      setDataToPrintOnFailure(
        t,
        'expectedPlace',
        getExpectedPlaceContext(place)
      );

      const placeRow = () => {
        return withinSearchResultList().getAllByTestId(place.id as string);
      };

      if (searchedField) {
        setDataToPrintOnFailure(
          t,
          'expectedPlace',
          getExpectedPlaceContext(place, searchedField)
        );
      }
      await pageIsLoaded();
      await t.expect(placeRow().count).gt(0, await getErrorMessage(t));

      const actions = {
        async clickPlaceRow() {
          await t.click(placeRow());
        },
      };

      return {
        expectations,
        actions,
      };
    };

    return {
      expectations,
      placeRow,
    };
  };

  const selectors = {
    createPlaceButton() {
      return withinPlacesPage().findByRole('button', {
        name: /lisää paikka/i,
      });
    },
  };

  const actions = {
    async clickCreatePlaceButton() {
      const result = await t.click(selectors.createPlaceButton());
      return result;
    },
  };

  return { actions, findSearchBanner, findSearchResultList, pageIsLoaded };
};
