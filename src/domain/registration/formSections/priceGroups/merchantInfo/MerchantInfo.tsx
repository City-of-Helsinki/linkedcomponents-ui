import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import TextInput from '../../../../../common/components/textInput/TextInput';
import { WebStoreMerchantFieldsFragment } from '../../../../../generated/graphql';
import getValue from '../../../../../utils/getValue';
import pascalCase from '../../../../../utils/pascalCase';
import { WEB_STORE_MERCHANT_FIELDS } from '../../../../organization/constants';
import useOrganizationMerchantById from '../../../../organization/hooks/useOrganizationMerchantById';
import { REGISTRATION_FIELDS } from '../../../constants';

type MerchantInfoProps = {
  id: string;
  publisher: string;
};

const getFieldName = (field: string) =>
  `${REGISTRATION_FIELDS.REGISTRATION_MERCHANT}.${field}`;

const MerchantInfo: FC<MerchantInfoProps> = ({ id, publisher }) => {
  const { t } = useTranslation();
  const merchant = useOrganizationMerchantById({
    id,
    organizationId: publisher,
  });

  if (!merchant) {
    return null;
  }

  const getFieldProps = (field: keyof WebStoreMerchantFieldsFragment) => ({
    id: getFieldName(field),
    label: t(`organization.form.merchant.label${pascalCase(field)}`),
    value: getValue(merchant[field]?.toString(), ''),
  });

  const fieldProps = {
    businessId: getFieldProps(WEB_STORE_MERCHANT_FIELDS.BUSINESS_ID),
    city: getFieldProps(WEB_STORE_MERCHANT_FIELDS.CITY),
    email: getFieldProps(WEB_STORE_MERCHANT_FIELDS.EMAIL),
    phoneNumber: getFieldProps(WEB_STORE_MERCHANT_FIELDS.PHONE_NUMBER),
    streetAddress: getFieldProps(WEB_STORE_MERCHANT_FIELDS.STREET_ADDRESS),
    termsOfServiceUrl: getFieldProps(
      WEB_STORE_MERCHANT_FIELDS.TERMS_OF_SERVICE_URL
    ),
    zipcode: getFieldProps(WEB_STORE_MERCHANT_FIELDS.ZIPCODE),
  };

  const fields = [
    fieldProps.streetAddress,
    fieldProps.zipcode,
    fieldProps.city,
    fieldProps.email,
    fieldProps.phoneNumber,
    fieldProps.termsOfServiceUrl,
    fieldProps.businessId,
  ];

  return (
    <FormGroup>
      {fields.map(({ id, ...props }) => (
        <FormGroup key={id}>
          <TextInput id={id} {...props} disabled={true} />
        </FormGroup>
      ))}
    </FormGroup>
  );
};

export default MerchantInfo;
