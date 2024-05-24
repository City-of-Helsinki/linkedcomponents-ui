import { Field, useField } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import CheckboxField from '../../../../common/components/formFields/checkboxField/CheckboxField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import {
  RegistrationAccountFieldsFragment,
  useOrganizationAccountsQuery,
} from '../../../../generated/graphql';
import getValue from '../../../../utils/getValue';
import parseIdFromAtId from '../../../../utils/parseIdFromAtId';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import useEventPublisher from '../../../event/hooks/useEventPublisher';
import usePriceGroupOptions from '../../../priceGroup/hooks/usePriceGroupOptions';
import { PriceGroupOption } from '../../../priceGroup/types';
import {
  REGISTRATION_ACCOUNT_FIELDS,
  REGISTRATION_FIELDS,
  REGISTRATION_MERCHANT_FIELDS,
} from '../../constants';
import { RegistrationAccountFormFields } from '../../types';
import { getRegistrationAccountInitialValues } from '../../utils';
import AccountField from './accountField/AccountField';
import AccountOverrideFields from './accountOverrideFields/AccountOverrideFields';
import MerchantField from './merchantField/MerchantField';
import MerchantInfo from './merchantInfo/MerchantInfo';
import PriceGroups from './PriceGroups';
import styles from './priceGroupSection.module.scss';
import PriceGroupValidationError from './priceGroupValidationError/PriceGroupValidationError';
import VatPercentageField from './vatPercentageField/VatPercentageField';

interface Props {
  isEditingAllowed: boolean;
}

const PriceGroupsSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  const fieldNames = {
    account: REGISTRATION_FIELDS.REGISTRATION_ACCOUNT,
    accountId: `${REGISTRATION_FIELDS.REGISTRATION_ACCOUNT}.${REGISTRATION_ACCOUNT_FIELDS.ACCOUNT}`,
    event: REGISTRATION_FIELDS.EVENT,
    hasPrice: REGISTRATION_FIELDS.HAS_PRICE,
    merchant: `${REGISTRATION_FIELDS.REGISTRATION_MERCHANT}.${REGISTRATION_MERCHANT_FIELDS.MERCHANT}`,
    priceGroupOptions: REGISTRATION_FIELDS.PRICE_GROUP_OPTIONS,
  };

  const [{ value: hasPrice }] = useField<boolean>(fieldNames.hasPrice);
  const [{ value: eventAtId }] = useField<string | null>(fieldNames.event);

  const [, , { setValue: setPriceGroupOptions }] = useField<PriceGroupOption[]>(
    fieldNames.priceGroupOptions
  );
  const [{ value: merchantId }] = useField(fieldNames.merchant);
  const [{ value: accountId }] = useField(fieldNames.accountId);
  const [, , { setValue: setAccount }] =
    useField<RegistrationAccountFormFields>(fieldNames.account);

  const eventId = getValue(parseIdFromAtId(eventAtId), '');
  const { publisher } = useEventPublisher({ eventId });

  const { data: accountsData } = useOrganizationAccountsQuery({
    skip: !publisher,
    variables: { id: publisher },
  });

  const handleAccountChange = (newAccountId: string | null) => {
    const account = accountsData?.organizationAccounts.find(
      (a) => a.id === Number(newAccountId)
    );
    setAccount(
      getRegistrationAccountInitialValues({
        account: Number(newAccountId),
        ...account,
      } as RegistrationAccountFieldsFragment)
    );
  };

  const { options: priceGroupOptions } = usePriceGroupOptions({ publisher });

  useEffect(() => {
    setPriceGroupOptions(priceGroupOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceGroupOptions]);

  return (
    <Fieldset heading={t('registration.form.sections.priceGroups')} hideLegend>
      <FormGroup className={styles.hasPrice}>
        <Field
          component={CheckboxField}
          disabled={!isEditingAllowed}
          label={t('registration.form.registrationPriceGroup.labelHasPrice')}
          name={REGISTRATION_FIELDS.HAS_PRICE}
        />
      </FormGroup>

      {hasPrice && (
        <>
          <FieldRow>
            <FieldColumn>
              <FormGroup>
                <VatPercentageField
                  disabled={!isEditingAllowed}
                  name={
                    REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS_VAT_PERCENTAGE
                  }
                  required={true}
                />
              </FormGroup>
            </FieldColumn>
          </FieldRow>

          <FieldRow>
            <FieldColumn>
              <PriceGroupValidationError />
            </FieldColumn>
          </FieldRow>

          <PriceGroups isEditingAllowed={isEditingAllowed} />

          <FieldRow>
            <FieldColumn>
              <FormGroup>
                <h3>
                  {t('registration.form.registrationMerchant.labelMerchant')}
                </h3>
                <MerchantField
                  disabled={!isEditingAllowed}
                  name={fieldNames.merchant}
                  publisher={publisher}
                  required={true}
                />
              </FormGroup>
              <MerchantInfo id={merchantId} publisher={publisher} />

              <FormGroup>
                <h3>
                  {t('registration.form.registrationAccount.labelAccount')}
                </h3>
                <AccountField
                  disabled={!isEditingAllowed}
                  name={fieldNames.accountId}
                  onChangeCb={handleAccountChange}
                  publisher={publisher}
                  required={true}
                />
              </FormGroup>
              {accountId && (
                <AccountOverrideFields
                  id={accountId}
                  isEditingAllowed={isEditingAllowed}
                  publisher={publisher}
                />
              )}
            </FieldColumn>
          </FieldRow>
        </>
      )}
    </Fieldset>
  );
};

export default PriceGroupsSection;
