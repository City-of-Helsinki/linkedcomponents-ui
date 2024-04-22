import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DeleteButton from '../../../../../common/components/deleteButton/DeleteButton';
import CheckboxField from '../../../../../common/components/formFields/checkboxField/CheckboxField';
import TextInputField from '../../../../../common/components/formFields/textInputField/TextInputField';
import { OrganizationFieldsFragment } from '../../../../../generated/graphql';
import getValue from '../../../../../utils/getValue';
import styles from '../../../../admin/layout/form.module.scss';
import FormRow from '../../../../admin/layout/formRow/FormRow';
import useUser from '../../../../user/hooks/useUser';
import {
  ORGANIZATION_FINANCIAL_INFO_ACTIONS,
  WEB_STORE_ACCOUNT_FIELDS,
} from '../../../constants';
import useOrganizationFormStyles from '../../../hooks/useOrganizationFormStyles';
import { checkIsEditFinancialInfoAllowed } from '../../../utils';

type Props = {
  isEditingAllowed: boolean;
  onDelete: () => void;
  accountPath: string;
  organization?: OrganizationFieldsFragment;
  showDeleteButton: boolean;
};

const getFieldName = (accountPath: string, field: string) =>
  `${accountPath}.${field}`;

const Account: React.FC<Props> = ({
  isEditingAllowed,
  onDelete,
  accountPath,
  organization,
  showDeleteButton,
}) => {
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

  const fieldNames = React.useMemo(
    () => ({
      active: getFieldName(accountPath, WEB_STORE_ACCOUNT_FIELDS.ACTIVE),
      balanceProfitCenter: getFieldName(
        accountPath,
        WEB_STORE_ACCOUNT_FIELDS.BALANCE_PROFIT_CENTER
      ),
      companyCode: getFieldName(
        accountPath,
        WEB_STORE_ACCOUNT_FIELDS.COMPANY_CODE
      ),
      internalOrder: getFieldName(
        accountPath,
        WEB_STORE_ACCOUNT_FIELDS.INTERNAL_ORDER
      ),
      mainLedgerAccount: getFieldName(
        accountPath,
        WEB_STORE_ACCOUNT_FIELDS.MAIN_LEDGER_ACCOUNT
      ),
      operationArea: getFieldName(
        accountPath,
        WEB_STORE_ACCOUNT_FIELDS.OPERATION_AREA
      ),
      profitCenter: getFieldName(
        accountPath,
        WEB_STORE_ACCOUNT_FIELDS.PROFIT_CENTER
      ),
      project: getFieldName(accountPath, WEB_STORE_ACCOUNT_FIELDS.PROJECT),
      vatCode: getFieldName(accountPath, WEB_STORE_ACCOUNT_FIELDS.VAT_CODE),
    }),
    [accountPath]
  );

  const { alignedInputStyle, inputRowBorderStyleIfOrganization } =
    useOrganizationFormStyles({ isEditingAllowed, organization });

  return (
    <>
      <FormRow className={styles.borderInMobile}>
        <Field
          component={CheckboxField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.account.labelActive`)}
          name={fieldNames.active}
          title={warning}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfOrganization}>
        <Field
          className={alignedInputStyle}
          component={TextInputField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.account.labelVatCode`)}
          name={fieldNames.vatCode}
          required
          title={warning}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfOrganization}>
        <Field
          className={alignedInputStyle}
          component={TextInputField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.account.labelCompanyCode`)}
          name={fieldNames.companyCode}
          required
          title={warning}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfOrganization}>
        <Field
          className={alignedInputStyle}
          component={TextInputField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.account.labelMainLedgerAccount`)}
          name={fieldNames.mainLedgerAccount}
          required
          title={warning}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfOrganization}>
        <Field
          className={alignedInputStyle}
          component={TextInputField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.account.labelBalanceProfitCenter`)}
          name={fieldNames.balanceProfitCenter}
          required
          title={warning}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfOrganization}>
        <Field
          className={alignedInputStyle}
          component={TextInputField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.account.labelInternalOrder`)}
          name={fieldNames.internalOrder}
          title={warning}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfOrganization}>
        <Field
          className={alignedInputStyle}
          component={TextInputField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.account.labelProfitCenter`)}
          name={fieldNames.profitCenter}
          title={warning}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfOrganization}>
        <Field
          className={alignedInputStyle}
          component={TextInputField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.account.labelProject`)}
          name={fieldNames.project}
          title={warning}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfOrganization}>
        <Field
          className={alignedInputStyle}
          component={TextInputField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.account.labelOperationArea`)}
          name={fieldNames.operationArea}
          title={warning}
        />
      </FormRow>
      {showDeleteButton && (
        <DeleteButton
          ariaLabel={t('organization.form.buttonDeleteAccount')}
          disabled={!editable || !isEditingAllowed}
          label={t('organization.form.buttonDeleteAccount')}
          onClick={onDelete}
        />
      )}
    </>
  );
};

export default Account;
