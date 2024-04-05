import { FieldArray, useField } from 'formik';
import { Button, IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Notification from '../../../../common/components/notification/Notification';
import { OrganizationFieldsFragment } from '../../../../generated/graphql';
import getValue from '../../../../utils/getValue';
import FormRow from '../../../admin/layout/formRow/FormRow';
import FieldWithButton from '../../../event/layout/FieldWithButton';
import useUser from '../../../user/hooks/useUser';
import {
  ORGANIZATION_FIELDS,
  ORGANIZATION_FINANCIAL_INFO_ACTIONS,
  WEB_STORE_ACCOUNT_INITIAL_VALUES,
} from '../../constants';
import { WebStoreAccountFormFields } from '../../types';
import { checkIsEditFinancialInfoAllowed } from '../../utils';
import Account from './account/Account';

interface Props {
  organization?: OrganizationFieldsFragment;
}

const getAccountPath = (index: number) =>
  `${ORGANIZATION_FIELDS.WEB_STORE_ACCOUNTS}[${index}]`;

const Accounts: React.FC<Props> = ({ organization }) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const action = organization
    ? ORGANIZATION_FINANCIAL_INFO_ACTIONS.MANAGE_IN_UPDATE
    : ORGANIZATION_FINANCIAL_INFO_ACTIONS.MANAGE_IN_CREATE;
  const { editable, warning } = checkIsEditFinancialInfoAllowed({
    action,
    organizationId: getValue(organization?.id, ''),
    t,
    user,
  });

  const [{ value: webStoreAccounts }] = useField<WebStoreAccountFormFields[]>({
    name: ORGANIZATION_FIELDS.WEB_STORE_ACCOUNTS,
  });

  return (
    <FieldArray
      name={ORGANIZATION_FIELDS.WEB_STORE_ACCOUNTS}
      render={(arrayHelpers) => (
        <>
          {!!warning && (
            <FormRow>
              <Notification type="info" label={warning} />
            </FormRow>
          )}
          {webStoreAccounts.map((account, index) => {
            return (
              <Account
                key={index}
                isEditingAllowed={editable}
                onDelete={() => arrayHelpers.remove(index)}
                accountPath={getAccountPath(index)}
                organization={organization}
                showDeleteButton={editable && !account.id}
              />
            );
          })}

          {editable && webStoreAccounts.length < 1 && (
            <FieldWithButton>
              <Button
                type="button"
                disabled={!editable}
                fullWidth={true}
                onClick={() =>
                  arrayHelpers.push(WEB_STORE_ACCOUNT_INITIAL_VALUES)
                }
                iconLeft={<IconPlus />}
                variant="primary"
                title={warning}
              >
                {t('organization.form.buttonAddAccount')}
              </Button>
            </FieldWithButton>
          )}
        </>
      )}
    />
  );
};

export default Accounts;
