/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import TestController from 'testcafe';

import { ImageFieldsFragment } from '../../src/generated/graphql';
import { getCommonComponents } from '../common.components';
import { getExpectedImageContext } from '../utils/image.utils';
import {
  getErrorMessage,
  screenContext,
  setDataToPrintOnFailure,
  withinContext,
} from '../utils/testcafe.utils';

export const getImagesPage = async (t: TestController) => {
  const within = withinContext(t);
  const screen = screenContext(t);

  const pageIsLoaded = async () =>
    await getCommonComponents(t)
      .loadingSpinner()
      .expectations.isNotPresent({ timeout: 20000 });

  await t.expect(screen.findByRole('main').exists).ok(await getErrorMessage(t));

  const withinImagesPage = () => {
    return within(screen.getByRole('main'));
  };

  const findSearchBanner = async () => {
    const selectors = {
      searchInput() {
        return withinImagesPage().getByRole('searchbox', {
          name: /hae kuvia/i,
        });
      },
      searchButton() {
        return withinImagesPage().getByRole('button', { name: /etsi/i });
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
      .expect(screen.findByTestId('image-result-list').exists)
      .ok(await getErrorMessage(t));

    const withinSearchResultList = () =>
      within(screen.getByTestId('image-result-list'));

    const expectations = {
      async allImageRowsAreVisible(images: ImageFieldsFragment[]) {
        for (const image of images) {
          await imageRow(image);
        }
      },
    };

    const imageRow = async (
      image: ImageFieldsFragment,
      searchedField?: keyof ImageFieldsFragment
    ) => {
      setDataToPrintOnFailure(
        t,
        'expectedImage',
        getExpectedImageContext(image)
      );

      const imageRow = () => {
        return withinSearchResultList().getAllByTestId(image.id);
      };

      if (searchedField) {
        setDataToPrintOnFailure(
          t,
          'expectedImage',
          getExpectedImageContext(image, searchedField)
        );
      }
      await pageIsLoaded();
      await t.expect(imageRow().count).gt(0, await getErrorMessage(t));

      const actions = {
        async clickImageRow() {
          await t.click(imageRow());
        },
      };

      return { actions, expectations };
    };

    return { expectations, imageRow };
  };

  const selectors = {
    createImageButton() {
      return withinImagesPage().findByRole('button', { name: /lisää kuva/i });
    },
  };

  const actions = {
    async clickCreateImageButton() {
      return await t.click(selectors.createImageButton());
    },
  };

  return { actions, findSearchBanner, findSearchResultList, pageIsLoaded };
};
