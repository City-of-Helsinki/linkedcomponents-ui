import { Field, useField } from 'formik';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteButton from '../../../../../common/components/deleteButton/DeleteButton';
import SingleSelectField from '../../../../../common/components/formFields/singleSelectField/SingleSelectField';
import TextInputField from '../../../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import FieldRow from '../../../../app/layout/fieldRow/FieldRow';
import SplittedRow from '../../../../app/layout/splittedRow/SplittedRow';
import FieldWithButton from '../../../../event/layout/FieldWithButton';
import usePriceGroupOptions from '../../../../priceGroup/hooks/usePriceGroupOptions';
import { REGISTRATION_PRICE_GROUP_FIELDS } from '../../../constants';
import { RegistrationPriceGroupFormFields } from '../../../types';
import { getPriceGroupOptionsForPriceGroup } from '../../../utils';

type Props = {
  isEditingAllowed: boolean;
  onDelete: () => void;
  publisher: string;
  priceGroup: RegistrationPriceGroupFormFields;
  priceGroups: RegistrationPriceGroupFormFields[];
  priceGroupPath: string;
  showDelete: boolean;
};

const getFieldName = (priceGroupPath: string, field: string) =>
  `${priceGroupPath}.${field}`;

const PriceGroup: React.FC<Props> = ({
  isEditingAllowed,
  onDelete,
  publisher,
  priceGroup,
  priceGroups,
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
    }),
    [priceGroupPath]
  );

  const [, , { setValue: setPrice }] = useField<string>(fieldNames.price);

  const { loading: loadingPriceGroupOptions, options: priceGroupOptions } =
    usePriceGroupOptions({ publisher });
  const filteredPriceGroupOptions = useMemo(
    () =>
      getPriceGroupOptionsForPriceGroup({
        currentPriceGroup: priceGroup,
        priceGroupOptions,
        selectedPriceGroups: priceGroups,
      }),
    [priceGroup, priceGroupOptions, priceGroups]
  );

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
              name={fieldNames.priceGroup}
              onChangeCb={(value: string) => {
                /* istanbul ignore else */
                if (priceGroupOptions.find((o) => o.value === value)?.isFree) {
                  setPrice('0.00');
                }
              }}
              options={filteredPriceGroupOptions}
              texts={{
                label: t(
                  'registration.form.registrationPriceGroup.labelPriceGroup'
                ),
                placeholder: t(
                  'registration.form.registrationPriceGroup.placeholderPriceGroup'
                ),
              }}
              required
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
            </SplittedRow>
          </FormGroup>
        </FieldWithButton>
      </FieldRow>
    </>
  );
};

export default PriceGroup;
