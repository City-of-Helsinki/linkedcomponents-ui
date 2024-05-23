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
import useAdminFormStyles from '../../../../admin/layout/hooks/useAdminFormStyles';
import useUser from '../../../../user/hooks/useUser';
import {
  ORGANIZATION_FINANCIAL_INFO_ACTIONS,
  WEB_STORE_ACCOUNT_FIELDS,
} from '../../../constants';
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
      name: getFieldName(accountPath, WEB_STORE_ACCOUNT_FIELDS.NAME),
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

  const { alignedInputStyle, inputRowBorderStyleIfHasInstance } =
    useAdminFormStyles({ isEditingAllowed, instance: organization });

  const commonFieldProps = {
    disabled: !editable || !isEditingAllowed,
    title: warning,
  };
  const commonInputFieldProps = {
    ...commonFieldProps,
    className: alignedInputStyle,
    component: TextInputField,
  };

  return (
    <>
      <FormRow className={styles.borderInMobile}>
        <Field
          {...commonFieldProps}
          component={CheckboxField}
          label={t(`organization.form.account.labelActive`)}
          name={fieldNames.active}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          {...commonInputFieldProps}
          label={t(`organization.form.account.labelName`)}
          name={fieldNames.name}
          required
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          {...commonInputFieldProps}
          label={t(`organization.form.account.labelVatCode`)}
          name={fieldNames.vatCode}
          required
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          {...commonInputFieldProps}
          label={t(`organization.form.account.labelCompanyCode`)}
          name={fieldNames.companyCode}
          required
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          {...commonInputFieldProps}
          label={t(`organization.form.account.labelMainLedgerAccount`)}
          name={fieldNames.mainLedgerAccount}
          required
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          {...commonInputFieldProps}
          label={t(`organization.form.account.labelBalanceProfitCenter`)}
          name={fieldNames.balanceProfitCenter}
          required
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          {...commonInputFieldProps}
          label={t(`organization.form.account.labelInternalOrder`)}
          name={fieldNames.internalOrder}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          {...commonInputFieldProps}
          label={t(`organization.form.account.labelProfitCenter`)}
          name={fieldNames.profitCenter}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          {...commonInputFieldProps}
          label={t(`organization.form.account.labelProject`)}
          name={fieldNames.project}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          {...commonInputFieldProps}
          label={t(`organization.form.account.labelOperationArea`)}
          name={fieldNames.operationArea}
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
