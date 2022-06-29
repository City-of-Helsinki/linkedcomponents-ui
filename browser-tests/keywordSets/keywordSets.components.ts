/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import TestController from 'testcafe';

import { KeywordSetFieldsFragment } from '../../src/generated/graphql';
import { getCommonComponents } from '../common.components';
import { getExpectedKeywordSetContext } from '../utils/keywordSet.utils';
import {
  getErrorMessage,
  screenContext,
  setDataToPrintOnFailure,
  withinContext,
} from '../utils/testcafe.utils';

export const getKeywordSetsPage = async (t: TestController) => {
  const within = withinContext(t);
  const screen = screenContext(t);

  const pageIsLoaded = async () =>
    await getCommonComponents(t)
      .loadingSpinner()
      .expectations.isNotPresent({ timeout: 20000 });

  await t.expect(screen.findByRole('main').exists).ok(await getErrorMessage(t));

  const withinKeywordSetsPage = () => {
    return within(screen.getByRole('main'));
  };

  const findSearchBanner = async () => {
    const selectors = {
      searchInput() {
        return withinKeywordSetsPage().getByRole('searchbox', {
          name: /hae avainsanaryhmiä/i,
        });
      },
      searchButton() {
        return withinKeywordSetsPage().getByRole('button', { name: /etsi/i });
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
      .expect(screen.findByTestId('keyword-set-result-list').exists)
      .ok(await getErrorMessage(t));

    const withinSearchResultList = () =>
      within(screen.getByTestId('keyword-set-result-list'));

    const expectations = {
      async allKeywordSetRowsAreVisible(
        keywordSets: KeywordSetFieldsFragment[]
      ) {
        for (const k of keywordSets) {
          await keywordSetRow(k);
        }
      },
    };

    const keywordSetRow = async (
      keywordSet: KeywordSetFieldsFragment,
      searchedField?: keyof KeywordSetFieldsFragment
    ) => {
      setDataToPrintOnFailure(
        t,
        'expectedKeyword',
        getExpectedKeywordSetContext(keywordSet)
      );

      const keywordSetRow = () => {
        return withinSearchResultList().getAllByTestId(keywordSet.id as string);
      };

      if (searchedField) {
        setDataToPrintOnFailure(
          t,
          'expectedKeyword',
          getExpectedKeywordSetContext(keywordSet, searchedField)
        );
      }
      await pageIsLoaded();
      await t.expect(keywordSetRow().count).gt(0, await getErrorMessage(t));

      const actions = {
        async clickKeywordSetRow() {
          await t.click(keywordSetRow());
        },
      };

      return {
        expectations,
        actions,
      };
    };

    return {
      keywordSetRow,
      expectations,
    };
  };

  const selectors = {
    createKeywordSetButton() {
      return withinKeywordSetsPage().findByRole('button', {
        name: /lisää avainsanaryhmä/i,
      });
    },
  };

  const actions = {
    async clickCreateKeywordSetButton() {
      const result = await t.click(selectors.createKeywordSetButton());
      return result;
    },
  };

  return { actions, findSearchBanner, findSearchResultList, pageIsLoaded };
};
