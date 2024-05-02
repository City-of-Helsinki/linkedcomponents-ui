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
  WEB_STORE_MERCHANT_FIELDS,
} from '../../../constants';
import { checkIsEditFinancialInfoAllowed } from '../../../utils';

type Props = {
  isEditingAllowed: boolean;
  onDelete: () => void;
  merchantPath: string;
  organization?: OrganizationFieldsFragment;
  showDeleteButton: boolean;
};

const getFieldName = (merchantPath: string, field: string) =>
  `${merchantPath}.${field}`;

const Merchant: React.FC<Props> = ({
  isEditingAllowed,
  onDelete,
  merchantPath,
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
      active: getFieldName(merchantPath, WEB_STORE_MERCHANT_FIELDS.ACTIVE),
      businessId: getFieldName(
        merchantPath,
        WEB_STORE_MERCHANT_FIELDS.BUSINESS_ID
      ),
      city: getFieldName(merchantPath, WEB_STORE_MERCHANT_FIELDS.CITY),
      email: getFieldName(merchantPath, WEB_STORE_MERCHANT_FIELDS.EMAIL),
      merchantId: getFieldName(
        merchantPath,
        WEB_STORE_MERCHANT_FIELDS.MERCHANT_ID
      ),
      name: getFieldName(merchantPath, WEB_STORE_MERCHANT_FIELDS.NAME),
      paytrailMerchantId: getFieldName(
        merchantPath,
        WEB_STORE_MERCHANT_FIELDS.PAYTRAIL_MERCHANT_ID
      ),
      phoneNumber: getFieldName(
        merchantPath,
        WEB_STORE_MERCHANT_FIELDS.PHONE_NUMBER
      ),
      streetAddress: getFieldName(
        merchantPath,
        WEB_STORE_MERCHANT_FIELDS.STREET_ADDRESS
      ),
      termsOfServiceUrl: getFieldName(
        merchantPath,
        WEB_STORE_MERCHANT_FIELDS.TERMS_OF_SERVICE_URL
      ),
      url: getFieldName(merchantPath, WEB_STORE_MERCHANT_FIELDS.URL),
      zipcode: getFieldName(merchantPath, WEB_STORE_MERCHANT_FIELDS.ZIPCODE),
    }),
    [merchantPath]
  );

  const { alignedInputStyle, inputRowBorderStyleIfHasInstance } =
    useAdminFormStyles({ isEditingAllowed, instance: organization });

  return (
    <>
      <FormRow className={styles.borderInMobile}>
        <Field
          component={CheckboxField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.merchant.labelActive`)}
          name={fieldNames.active}
          title={warning}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          className={alignedInputStyle}
          component={TextInputField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.merchant.labelName`)}
          name={fieldNames.name}
          required
          title={warning}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          className={alignedInputStyle}
          component={TextInputField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.merchant.labelStreetAddress`)}
          name={fieldNames.streetAddress}
          required
          title={warning}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          className={alignedInputStyle}
          component={TextInputField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.merchant.labelZipcode`)}
          name={fieldNames.zipcode}
          required
          title={warning}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          className={alignedInputStyle}
          component={TextInputField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.merchant.labelCity`)}
          name={fieldNames.city}
          required
          title={warning}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          className={alignedInputStyle}
          component={TextInputField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.merchant.labelEmail`)}
          name={fieldNames.email}
          required
          title={warning}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          className={alignedInputStyle}
          component={TextInputField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.merchant.labelPhoneNumber`)}
          name={fieldNames.phoneNumber}
          required
          title={warning}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          className={alignedInputStyle}
          component={TextInputField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.merchant.labelUrl`)}
          name={fieldNames.url}
          required
          title={warning}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          className={alignedInputStyle}
          component={TextInputField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.merchant.labelTermsOfServiceUrl`)}
          name={fieldNames.termsOfServiceUrl}
          required
          title={warning}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          className={alignedInputStyle}
          component={TextInputField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.merchant.labelBusinessId`)}
          name={fieldNames.businessId}
          required
          title={warning}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          className={alignedInputStyle}
          component={TextInputField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.merchant.labelPaytrailMerchantId`)}
          name={fieldNames.paytrailMerchantId}
          required
          title={warning}
        />
      </FormRow>
      <FormRow className={styles.borderInMobile}>
        <Field
          className={styles.alignedInputWithFullBorder}
          component={TextInputField}
          disabled={!editable || !isEditingAllowed}
          label={t(`organization.form.merchant.labelMerchantId`)}
          name={fieldNames.merchantId}
          readOnly={true}
          title={warning}
        />
      </FormRow>
      {showDeleteButton && (
        <DeleteButton
          ariaLabel={t('organization.form.buttonDeleteMerchant')}
          disabled={!editable || !isEditingAllowed}
          label={t('organization.form.buttonDeleteMerchant')}
          onClick={onDelete}
        />
      )}
    </>
  );
};

export default Merchant;
