/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import TestController from 'testcafe';

import { OrganizationFieldsFragment } from '../../src/generated/graphql';
import { getCommonComponents } from '../common.components';
import { getExpectedOrganizationContext } from '../utils/organization.utils';
import {
  getErrorMessage,
  screenContext,
  setDataToPrintOnFailure,
  withinContext,
} from '../utils/testcafe.utils';

export const getOrganizationsPage = async (t: TestController) => {
  const within = withinContext(t);
  const screen = screenContext(t);

  const pageIsLoaded = async () =>
    await getCommonComponents(t)
      .loadingSpinner()
      .expectations.isNotPresent({ timeout: 20000 });

  await t.expect(screen.findByRole('main').exists).ok(await getErrorMessage(t));

  const withinOrganizationsPage = () => {
    return within(screen.getByRole('main'));
  };

  const findSearchBanner = async () => {
    const selectors = {
      searchInput() {
        return withinOrganizationsPage().getByRole('searchbox', {
          name: /hae organisaatioita/i,
        });
      },
      searchButton() {
        return withinOrganizationsPage().getByRole('button', { name: /etsi/i });
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
      .expect(screen.findByTestId('organization-result-list').exists)
      .ok(await getErrorMessage(t));

    const withinSearchResultList = () =>
      within(screen.getByTestId('organization-result-list'));

    const expectations = {
      async allOrganizationsRowsAreVisible(
        organizations: OrganizationFieldsFragment[]
      ) {
        for (const o of organizations) {
          await organizationRow(o);
        }
      },
    };

    const organizationRow = async (
      organization: OrganizationFieldsFragment,
      searchedField?: keyof OrganizationFieldsFragment
    ) => {
      setDataToPrintOnFailure(
        t,
        'expectedOrganization',
        getExpectedOrganizationContext(organization)
      );

      const organizationRow = () => {
        return withinSearchResultList().getAllByTestId(
          organization.id as string
        );
      };

      if (searchedField) {
        setDataToPrintOnFailure(
          t,
          'expectedOrganization',
          getExpectedOrganizationContext(organization, searchedField)
        );
      }
      await pageIsLoaded();
      await t.expect(organizationRow().count).gt(0, await getErrorMessage(t));

      const actions = {
        async clickOrganizationRow() {
          await t.click(organizationRow());
        },
      };

      return {
        expectations,
        actions,
      };
    };

    return {
      organizationRow,
      expectations,
    };
  };

  const selectors = {
    createOrganizationButton() {
      return withinOrganizationsPage().findByRole('button', {
        name: /lisää uusi organisaatio/i,
      });
    },
  };

  const actions = {
    async clickCreateOrganizationButton() {
      const result = await t.click(selectors.createOrganizationButton());
      return result;
    },
  };

  return { actions, findSearchBanner, findSearchResultList, pageIsLoaded };
};
