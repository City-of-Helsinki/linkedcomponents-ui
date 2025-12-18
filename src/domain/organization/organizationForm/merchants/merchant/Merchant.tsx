import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DeleteButton from '../../../../../common/components/deleteButton/DeleteButton';
import CheckboxField from '../../../../../common/components/formFields/checkboxField/CheckboxField';
import TextInputField from '../../../../../common/components/formFields/textInputField/TextInputField';
import { OrganizationFieldsFragment } from '../../../../../generated/graphql';
import styles from '../../../../admin/layout/form.module.scss';
import FormRow from '../../../../admin/layout/formRow/FormRow';
import useAdminFormStyles from '../../../../admin/layout/hooks/useAdminFormStyles';
import { WEB_STORE_MERCHANT_FIELDS } from '../../../constants';

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
      zipcode: getFieldName(merchantPath, WEB_STORE_MERCHANT_FIELDS.ZIPCODE),
    }),
    [merchantPath]
  );

  const { alignedInputStyle, inputRowBorderStyleIfHasInstance } =
    useAdminFormStyles({ isEditingAllowed, instance: organization });

  const commonFieldProps = {
    disabled: !isEditingAllowed,
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
          label={t(`organization.form.merchant.labelActive`)}
          name={fieldNames.active}
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          {...commonInputFieldProps}
          label={t(`organization.form.merchant.labelName`)}
          name={fieldNames.name}
          required
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          {...commonInputFieldProps}
          label={t(`organization.form.merchant.labelStreetAddress`)}
          name={fieldNames.streetAddress}
          required
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          {...commonInputFieldProps}
          label={t(`organization.form.merchant.labelZipcode`)}
          name={fieldNames.zipcode}
          required
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          {...commonInputFieldProps}
          label={t(`organization.form.merchant.labelCity`)}
          name={fieldNames.city}
          required
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          {...commonInputFieldProps}
          label={t(`organization.form.merchant.labelEmail`)}
          name={fieldNames.email}
          required
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          {...commonInputFieldProps}
          label={t(`organization.form.merchant.labelPhoneNumber`)}
          name={fieldNames.phoneNumber}
          required
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          {...commonInputFieldProps}
          label={t(`organization.form.merchant.labelTermsOfServiceUrl`)}
          name={fieldNames.termsOfServiceUrl}
          required
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          {...commonInputFieldProps}
          label={t(`organization.form.merchant.labelBusinessId`)}
          name={fieldNames.businessId}
          required
        />
      </FormRow>
      <FormRow className={inputRowBorderStyleIfHasInstance}>
        <Field
          {...commonInputFieldProps}
          label={t(`organization.form.merchant.labelPaytrailMerchantId`)}
          name={fieldNames.paytrailMerchantId}
          required
        />
      </FormRow>
      <FormRow className={styles.borderInMobile}>
        <Field
          {...commonInputFieldProps}
          className={styles.alignedInputWithFullBorder}
          label={t(`organization.form.merchant.labelMerchantId`)}
          name={fieldNames.merchantId}
          readOnly={true}
        />
      </FormRow>
      {showDeleteButton && (
        <DeleteButton
          ariaLabel={t('organization.form.buttonDeleteMerchant')}
          disabled={!isEditingAllowed}
          label={t('organization.form.buttonDeleteMerchant')}
          onClick={onDelete}
        />
      )}
    </>
  );
};

export default Merchant;
