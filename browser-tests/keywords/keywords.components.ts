/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import TestController from 'testcafe';

import { KeywordFieldsFragment } from '../../src/generated/graphql';
import { getCommonComponents } from '../common.components';
import { getExpectedKeywordContext } from '../utils/keyword.utils';
import {
  getErrorMessage,
  screenContext,
  setDataToPrintOnFailure,
  withinContext,
} from '../utils/testcafe.utils';

export const getKeywordsPage = async (t: TestController) => {
  const within = withinContext(t);
  const screen = screenContext(t);

  const pageIsLoaded = async () =>
    await getCommonComponents(t)
      .loadingSpinner()
      .expectations.isNotPresent({ timeout: 20000 });

  await t.expect(screen.findByRole('main').exists).ok(await getErrorMessage(t));

  const withinKeywordsPage = () => {
    return within(screen.getByRole('main'));
  };

  const findSearchBanner = async () => {
    const selectors = {
      searchInput() {
        return withinKeywordsPage().getByRole('combobox', {
          name: /hae avainsanoja/i,
        });
      },
      searchButton() {
        return withinKeywordsPage().getByRole('button', { name: /etsi/i });
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
      .expect(screen.findByTestId('keyword-result-list').exists)
      .ok(await getErrorMessage(t));

    const withinSearchResultList = () =>
      within(screen.getByTestId('keyword-result-list'));

    const expectations = {
      async allKeywordRowsAreVisible(keywords: KeywordFieldsFragment[]) {
        for (const k of keywords) {
          await keywordRow(k);
        }
      },
    };

    const keywordRow = async (
      keyword: KeywordFieldsFragment,
      searchedField?: keyof KeywordFieldsFragment
    ) => {
      setDataToPrintOnFailure(
        t,
        'expectedKeyword',
        getExpectedKeywordContext(keyword)
      );

      const keywordRow = () => {
        return withinSearchResultList().getAllByTestId(keyword.id as string);
      };

      if (searchedField) {
        setDataToPrintOnFailure(
          t,
          'expectedKeyword',
          getExpectedKeywordContext(keyword, searchedField)
        );
      }
      await pageIsLoaded();
      await t.expect(keywordRow().count).gt(0, await getErrorMessage(t));

      const actions = {
        async clickKeywordRow() {
          await t.click(keywordRow());
        },
      };

      return {
        expectations,
        actions,
      };
    };

    return {
      keywordRow,
      expectations,
    };
  };

  const selectors = {
    createKeywordButton() {
      return withinKeywordsPage().findByRole('button', {
        name: /lisää avainsana/i,
      });
    },
  };

  const actions = {
    async clickCreateKeywordButton() {
      const result = await t.click(selectors.createKeywordButton());
      return result;
    },
  };

  return { actions, findSearchBanner, findSearchResultList, pageIsLoaded };
};
