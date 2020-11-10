import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DeleteButton from '../../../../common/components/deleteButton/DeleteButton';
import MultiLanguageField from '../../../../common/components/formFields/MultiLanguageField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import { EVENT_FIELDS } from '../../constants';
import PriceSectionRow from './PriceSectionRow';

type Props = {
  offerPath: string;
  onDelete?: () => void;
  type: string;
};

const getFieldName = (offerPath: string, field: string) =>
  offerPath ? `${offerPath}.${field}` : field;

const Offer: React.FC<Props> = ({ offerPath, onDelete, type }) => {
  const { t } = useTranslation();

  const [{ value: eventInfoLanguages }] = useField({
    name: EVENT_FIELDS.EVENT_INFO_LANGUAGES,
  });

  return (
    <>
      <h3>{t('event.form.titleOfferPrice')}</h3>
      <PriceSectionRow
        input={
          <>
            <FormGroup>
              <MultiLanguageField
                name={getFieldName(offerPath, EVENT_FIELDS.OFFER_PRICE)}
                labelKey={`event.form.labelOfferPrice`}
                languages={eventInfoLanguages}
                placeholderKey={`event.form.placeholderOfferPrice.${type}`}
                required={true}
              />
            </FormGroup>
            <FormGroup>
              <h3>{t('event.form.titleOfferInfoUrl')}</h3>
              <MultiLanguageField
                name={getFieldName(offerPath, EVENT_FIELDS.OFFER_INFO_URL)}
                labelKey={`event.form.labelOfferInfoUrl`}
                languages={eventInfoLanguages}
                placeholderKey={`event.form.placeholderOfferInfoUrl`}
                required={true}
              />
            </FormGroup>
            <FormGroup>
              <h3>{t('event.form.titleOfferDescription')}</h3>
              <MultiLanguageField
                name={getFieldName(offerPath, EVENT_FIELDS.OFFER_DESCRIPTION)}
                labelKey={`event.form.labelOfferDescription`}
                languages={eventInfoLanguages}
                placeholderKey={`event.form.placeholderOfferDescription`}
                required={true}
              />
            </FormGroup>
          </>
        }
        button={
          onDelete ? (
            <DeleteButton
              label={t('event.form.buttonDeleteOffer')}
              onClick={onDelete}
            />
          ) : undefined
        }
      />
    </>
  );
};

export default Offer;
