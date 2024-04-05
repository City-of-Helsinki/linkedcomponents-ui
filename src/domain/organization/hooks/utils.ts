import { TFunction } from 'i18next';

import { LEServerError, ServerErrorItem } from '../../../types';
import parseServerErrorArray from '../../../utils/parseServerErrorArray';
import parseServerErrorLabel from '../../../utils/parseServerErrorLabel';
import parseServerErrorMessage from '../../../utils/parseServerErrorMessage';
import { parseServerErrors } from '../../../utils/parseServerErrors';
import pascalCase from '../../../utils/pascalCase';

export const parseOrganizationServerErrors = ({
  result,
  t,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: LEServerError;
  t: TFunction;
}): ServerErrorItem[] => {
  return parseServerErrors({
    parseServerError: parseOrganizationServerError,
    result,
    t,
  });

  // Get error item for an single error.
  function parseOrganizationServerError({
    error,
    key,
  }: {
    error: LEServerError;
    key: string;
  }) {
    if (key === 'web_store_accounts') {
      return parseWebStoreAccountServerErrors({ error });
    }
    if (key === 'web_store_merchants') {
      return parseWebStoreMerchantServerErrors({ error });
    }
    return [
      {
        label: parseServerErrorLabel({
          key,
          parseFn: parseOrganizationServerErrorLabel,
        }),
        message: parseServerErrorMessage({ error, t }),
      },
    ];
  }

  // Get correct field name for an error item
  function parseOrganizationServerErrorLabel({ key }: { key: string }): string {
    return t(`organization.form.label${pascalCase(key)}`);
  }

  // Get error items for web store merchant fields
  function parseWebStoreAccountServerErrors({
    error,
  }: {
    error: LEServerError;
  }): ServerErrorItem[] {
    return parseServerErrorArray({
      error,
      parseLabelFn: ({ key }) =>
        parseServerErrorLabel({
          key,
          parseFn: parseWebStoreAccountServerErrorLabel,
        }),
      t,
    });
  }

  // Get error items for web store merchant fields
  function parseWebStoreMerchantServerErrors({
    error,
  }: {
    error: LEServerError;
  }): ServerErrorItem[] {
    return parseServerErrorArray({
      error,
      parseLabelFn: ({ key }) =>
        parseServerErrorLabel({
          key,
          parseFn: parseWebStoreMerchantServerErrorLabel,
        }),
      t,
    });
  }

  function parseWebStoreAccountServerErrorLabel({
    key,
  }: {
    key: string;
  }): string {
    return t(`organization.form.account.label${pascalCase(key)}`);
  }

  function parseWebStoreMerchantServerErrorLabel({
    key,
  }: {
    key: string;
  }): string {
    return t(`organization.form.merchant.label${pascalCase(key)}`);
  }
};
