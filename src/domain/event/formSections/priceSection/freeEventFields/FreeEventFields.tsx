import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import MultiLanguageField from '../../../../../common/components/formFields/multiLanguageField/MultiLanguageField';
import FieldColumn from '../../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../../app/layout/fieldRow/FieldRow';
import { EVENT_FIELDS } from '../../../constants';
import PriceNotification from '../priceNotification/PriceNotification';

type Props = {
  isEditingAllowed: boolean;
};

const getFieldName = (offerPath: string, field: string) =>
  `${offerPath}.${field}`;

const FreeEventFields: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  const [{ value: eventInfoLanguages }] = useField({
    name: EVENT_FIELDS.EVENT_INFO_LANGUAGES,
  });

  return (
    <FieldRow notification={<PriceNotification />}>
      <FieldColumn>
        <h3>{t('event.form.titleOfferInfoUrl')}</h3>
        <MultiLanguageField
          disabled={!isEditingAllowed}
          labelKey={`event.form.labelOfferInfoUrl`}
          languages={eventInfoLanguages}
          name={getFieldName(
            `${EVENT_FIELDS.OFFERS}[0]`,
            EVENT_FIELDS.OFFER_INFO_URL
          )}
          placeholderKey={`event.form.placeholderOfferInfoUrl`}
        />
      </FieldColumn>
    </FieldRow>
  );
};

export default FreeEventFields;
