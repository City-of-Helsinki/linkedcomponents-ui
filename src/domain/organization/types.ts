import { ORGANIZATION_FIELDS, WEB_STORE_MERCHANT_FIELDS } from './constants';

export type OrganizationFields = {
  affiliatedOrganizations: string[];
  atId: string;
  classification: string;
  dataSource: string;
  foundingDate: Date | null;
  fullName: string;
  id: string;
  name: string;
  organizationUrl: string;
  originId: string;
  parentOrganization: string | null;
  subOrganizations: string[];
};

export type WebStoreMerchantFormFields = {
  [WEB_STORE_MERCHANT_FIELDS.ACTIVE]: boolean;
  [WEB_STORE_MERCHANT_FIELDS.BUSINESS_ID]: string;
  [WEB_STORE_MERCHANT_FIELDS.CITY]: string;
  [WEB_STORE_MERCHANT_FIELDS.EMAIL]: string;
  [WEB_STORE_MERCHANT_FIELDS.ID]: number | null;
  [WEB_STORE_MERCHANT_FIELDS.MERCHANT_ID]: string;
  [WEB_STORE_MERCHANT_FIELDS.NAME]: string;
  [WEB_STORE_MERCHANT_FIELDS.PAYTRAIL_MERCHANT_ID]: string;
  [WEB_STORE_MERCHANT_FIELDS.PHONE_NUMBER]: string;
  [WEB_STORE_MERCHANT_FIELDS.STREET_ADDRESS]: string;
  [WEB_STORE_MERCHANT_FIELDS.TERMS_OF_SERVICE_URL]: string;
  [WEB_STORE_MERCHANT_FIELDS.URL]: string;
  [WEB_STORE_MERCHANT_FIELDS.ZIPCODE]: string;
};

export type OrganizationFormFields = {
  [ORGANIZATION_FIELDS.ADMIN_USERS]: string[];
  [ORGANIZATION_FIELDS.AFFILIATED_ORGANIZATIONS]: string[];
  [ORGANIZATION_FIELDS.CLASSIFICATION]: string;
  [ORGANIZATION_FIELDS.DATA_SOURCE]: string;
  [ORGANIZATION_FIELDS.DISSOLUTION_DATE]: Date | null;
  [ORGANIZATION_FIELDS.FINANCIAL_ADMIN_USERS]: string[];
  [ORGANIZATION_FIELDS.FOUNDING_DATE]: Date | null;
  [ORGANIZATION_FIELDS.ID]: string;
  [ORGANIZATION_FIELDS.INTERNAL_TYPE]: string;
  [ORGANIZATION_FIELDS.NAME]: string;
  [ORGANIZATION_FIELDS.ORIGIN_ID]: string;
  [ORGANIZATION_FIELDS.PARENT_ORGANIZATION]: string;
  [ORGANIZATION_FIELDS.REGISTRATION_ADMIN_USERS]: string[];
  [ORGANIZATION_FIELDS.REGULAR_USERS]: string[];
  [ORGANIZATION_FIELDS.REPLACED_BY]: string;
  [ORGANIZATION_FIELDS.SUB_ORGANIZATIONS]: string[];
  [ORGANIZATION_FIELDS.WEB_STORE_MERCHANTS]: WebStoreMerchantFormFields[];
};
