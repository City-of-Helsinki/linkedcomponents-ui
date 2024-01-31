import { Field, useField } from 'formik';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteButton from '../../../../../common/components/deleteButton/DeleteButton';
import SingleSelectField from '../../../../../common/components/formFields/singleSelectField/SingleSelectField';
import TextInputField from '../../../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import parseIdFromAtId from '../../../../../utils/parseIdFromAtId';
import skipFalsyType from '../../../../../utils/skipFalsyType';
import FieldRow from '../../../../app/layout/fieldRow/FieldRow';
import SplittedRow from '../../../../app/layout/splittedRow/SplittedRow';
import FieldWithButton from '../../../../event/layout/FieldWithButton';
import usePriceGroupOptions from '../../../../priceGroup/hooks/usePriceGroupOptions';
import useVatOptions from '../../../../priceGroup/hooks/useVatOptions';
import {
  REGISTRATION_FIELDS,
  REGISTRATION_PRICE_GROUP_FIELDS,
} from '../../../constants';
import { RegistrationPriceGroupFormFields } from '../../../types';

type Props = {
  isEditingAllowed: boolean;
  onDelete: () => void;
  priceGroup: RegistrationPriceGroupFormFields;
  priceGroupPath: string;
  showDelete: boolean;
};

const getFieldName = (priceGroupPath: string, field: string) =>
  `${priceGroupPath}.${field}`;

const PriceGroup: React.FC<Props> = ({
  isEditingAllowed,
  onDelete,
  priceGroup,
  priceGroupPath,
  showDelete,
}) => {
  const { t } = useTranslation();

  const fieldNames = React.useMemo(
    () => ({
      id: getFieldName(priceGroupPath, REGISTRATION_PRICE_GROUP_FIELDS.ID),
      price: getFieldName(
        priceGroupPath,
        REGISTRATION_PRICE_GROUP_FIELDS.PRICE
      ),
      priceGroup: getFieldName(
        priceGroupPath,
        REGISTRATION_PRICE_GROUP_FIELDS.PRICE_GROUP
      ),
      vatPercentage: getFieldName(
        priceGroupPath,
        REGISTRATION_PRICE_GROUP_FIELDS.VAT_PERCENTAGE
      ),
    }),
    [priceGroupPath]
  );

  const [{ value: eventAtId }] = useField<string | null>(
    REGISTRATION_FIELDS.EVENT
  );
  const [{ value: priceGroups }] = useField<RegistrationPriceGroupFormFields[]>(
    REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS
  );
  const [, , { setValue: setPrice }] = useField<string>(fieldNames.price);

  const eventId = parseIdFromAtId(eventAtId);
  const { loading: loadingPriceGroupOptions, options: priceGroupOptions } =
    usePriceGroupOptions({ eventId });
  const filteredPriceGroupOptions = useMemo(() => {
    const disabledOptions = priceGroups
      .filter(
        (pg) => pg !== priceGroup && pg.priceGroup !== priceGroup.priceGroup
      )
      .map((pg) => pg.priceGroup?.toString())
      .filter(skipFalsyType);

    return priceGroupOptions.filter((o) => !disabledOptions.includes(o.value));
  }, [priceGroup, priceGroupOptions, priceGroups]);

  const vatOptions = useVatOptions();

  const isFree = useMemo(() => {
    return !!priceGroupOptions.find((pg) => pg.value === priceGroup.priceGroup)
      ?.isFree;
  }, [priceGroup.priceGroup, priceGroupOptions]);

  return (
    <>
      <h3>{t(`registration.form.titlePriceGroup`)}</h3>
      <FieldRow>
        <FieldWithButton
          button={
            showDelete && (
              <DeleteButton
                ariaLabel={t('registration.form.buttonDeletePriceGroup')}
                disabled={!isEditingAllowed}
                onClick={onDelete}
              />
            )
          }
        >
          <FormGroup>
            <Field
              component={SingleSelectField}
              disabled={!isEditingAllowed}
              isLoading={loadingPriceGroupOptions}
              label={t(
                'registration.form.registrationPriceGroup.labelPriceGroup'
              )}
              name={fieldNames.priceGroup}
              onChangeCb={(value: string) => {
                /* istanbul ignore else */
                if (priceGroupOptions.find((o) => o.value === value)?.isFree) {
                  setPrice('0.00');
                }
              }}
              options={filteredPriceGroupOptions}
              placeholder={t(
                'registration.form.registrationPriceGroup.placeholderPriceGroup'
              )}
              required={true}
            />
          </FormGroup>
          <FormGroup>
            <SplittedRow>
              <Field
                component={TextInputField}
                disabled={!isEditingAllowed || isFree}
                label={t('registration.form.registrationPriceGroup.labelPrice')}
                name={fieldNames.price}
                placeholder={t(
                  'registration.form.registrationPriceGroup.placeholderPrice'
                )}
                required={true}
                min="0"
                step="0.01"
                type="number"
              />
              <Field
                component={SingleSelectField}
                disabled={!isEditingAllowed}
                label={t(
                  'registration.form.registrationPriceGroup.labelVatPercentage'
                )}
                name={fieldNames.vatPercentage}
                options={vatOptions}
                placeholder={t(
                  'registration.form.registrationPriceGroup.placeholderVatPercentage'
                )}
                required={true}
              />
            </SplittedRow>
          </FormGroup>
        </FieldWithButton>
      </FieldRow>
    </>
  );
};

export default PriceGroup;
