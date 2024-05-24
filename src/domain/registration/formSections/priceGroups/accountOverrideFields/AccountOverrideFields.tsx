import { Field, useField } from 'formik';
import { Button } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import TextInputField from '../../../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import {
  RegistrationAccountFieldsFragment,
  WebStoreAccountFieldsFragment,
} from '../../../../../generated/graphql';
import getValue from '../../../../../utils/getValue';
import pascalCase from '../../../../../utils/pascalCase';
import useOrganizationAccountById from '../../../../organization/hooks/useOrganizationAccountById';
import {
  REGISTRATION_ACCOUNT_FIELDS,
  REGISTRATION_FIELDS,
} from '../../../constants';
import { RegistrationAccountFormFields } from '../../../types';
import { getRegistrationAccountInitialValues } from '../../../utils';

type Props = {
  id: string;
  isEditingAllowed: boolean;
  publisher: string;
};

const getFieldName = (field: string) =>
  `${REGISTRATION_FIELDS.REGISTRATION_ACCOUNT}.${field}`;

const AccountOverrideFields: React.FC<Props> = ({
  id,
  isEditingAllowed,
  publisher,
}) => {
  const { t } = useTranslation();

  const account = useOrganizationAccountById({
    id,
    organizationId: publisher,
  });

  const [, , { setValue: setAccount }] =
    useField<RegistrationAccountFormFields>(
      REGISTRATION_FIELDS.REGISTRATION_ACCOUNT
    );

  const getFieldProps = (
    field: keyof WebStoreAccountFieldsFragment,
    required = false
  ) => ({
    helperText: t('registration.form.registrationAccount.helperDefaultValue', {
      value: getValue(account?.[field], '-'),
    }),
    label: t(`registration.form.registrationAccount.label${pascalCase(field)}`),
    name: getFieldName(field),
    placeholder: t(
      `registration.form.registrationAccount.placeholder${pascalCase(field)}`
    ),
    required,
  });
  const fieldProps = {
    balanceProfitCenter: getFieldProps(
      REGISTRATION_ACCOUNT_FIELDS.BALANCE_PROFIT_CENTER,
      true
    ),
    companyCode: getFieldProps(REGISTRATION_ACCOUNT_FIELDS.COMPANY_CODE, true),
    internalOrder: getFieldProps(REGISTRATION_ACCOUNT_FIELDS.INTERNAL_ORDER),
    mainLedgerAccount: getFieldProps(
      REGISTRATION_ACCOUNT_FIELDS.MAIN_LEDGER_ACCOUNT,
      true
    ),
    operationArea: getFieldProps(REGISTRATION_ACCOUNT_FIELDS.OPERATION_AREA),
    profitCenter: getFieldProps(REGISTRATION_ACCOUNT_FIELDS.PROFIT_CENTER),
    project: getFieldProps(REGISTRATION_ACCOUNT_FIELDS.PROJECT),
  };

  const fields = [
    fieldProps.companyCode,
    fieldProps.mainLedgerAccount,
    fieldProps.balanceProfitCenter,
    fieldProps.internalOrder,
    fieldProps.profitCenter,
    fieldProps.project,
    fieldProps.operationArea,
  ];

  const restoreDefaults = () => {
    setAccount(
      getRegistrationAccountInitialValues({
        account: Number(id),
        ...account,
      } as RegistrationAccountFieldsFragment)
    );
  };

  return (
    <>
      {fields.map(({ name, ...props }) => (
        <FormGroup key={name}>
          <Field
            {...props}
            component={TextInputField}
            disabled={!isEditingAllowed}
            name={name}
          />
        </FormGroup>
      ))}
      <Button fullWidth onClick={restoreDefaults}>
        {t('registration.form.registrationAccount.buttonReturnDefaults')}
      </Button>
    </>
  );
};

export default AccountOverrideFields;
