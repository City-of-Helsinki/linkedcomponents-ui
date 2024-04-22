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
  WEB_STORE_MERCHANT_INITIAL_VALUES,
} from '../../constants';
import { WebStoreMerchantFormFields } from '../../types';
import { checkIsEditFinancialInfoAllowed } from '../../utils';
import Merchant from './merchant/Merchant';

interface Props {
  organization?: OrganizationFieldsFragment;
}

const getMerchantPath = (index: number) =>
  `${ORGANIZATION_FIELDS.WEB_STORE_MERCHANTS}[${index}]`;

const Merchants: React.FC<Props> = ({ organization }) => {
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

  const [{ value: webStoreMerchants }] = useField<WebStoreMerchantFormFields[]>(
    { name: ORGANIZATION_FIELDS.WEB_STORE_MERCHANTS }
  );

  return (
    <FieldArray
      name={ORGANIZATION_FIELDS.WEB_STORE_MERCHANTS}
      render={(arrayHelpers) => (
        <>
          {!!warning && (
            <FormRow>
              <Notification type="info" label={warning} />
            </FormRow>
          )}
          {webStoreMerchants.map((merchant, index) => {
            return (
              <Merchant
                key={index}
                isEditingAllowed={editable}
                onDelete={() => arrayHelpers.remove(index)}
                merchantPath={getMerchantPath(index)}
                organization={organization}
                showDeleteButton={editable && !merchant.id}
              />
            );
          })}

          {editable && webStoreMerchants.length < 1 && (
            <FieldWithButton>
              <Button
                type="button"
                disabled={!editable}
                fullWidth={true}
                onClick={() =>
                  arrayHelpers.push(WEB_STORE_MERCHANT_INITIAL_VALUES)
                }
                iconLeft={<IconPlus />}
                variant="primary"
                title={warning}
              >
                {t('organization.form.buttonAddMerchant')}
              </Button>
            </FieldWithButton>
          )}
        </>
      )}
    />
  );
};

export default Merchants;
