import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DeleteButton from '../../../../../../common/components/deleteButton/DeleteButton';
import MultiLanguageField from '../../../../../../common/components/formFields/multiLanguageField/MultiLanguageField';
import FormGroup from '../../../../../../common/components/formGroup/FormGroup';
import { featureFlagUtils } from '../../../../../../utils/featureFlags';
import FieldRow from '../../../../../app/layout/fieldRow/FieldRow';
import { EVENT_FIELDS, EVENT_OFFER_FIELDS } from '../../../../constants';
import styles from '../../../../eventPage.module.scss';
import FieldWithButton from '../../../../layout/FieldWithButton';
import PriceNotification from '../../priceNotification/PriceNotification';
import OfferPriceGroups from './offerPriceGroups/OfferPriceGroups';

type Props = {
  isEditingAllowed: boolean;
  offerPath: string;
  onDelete: () => void;
  showDelete: boolean;
};

const getFieldName = (offerPath: string, field: string) =>
  `${offerPath}.${field}`;

const Offer: React.FC<Props> = ({
  isEditingAllowed,
  offerPath,
  onDelete,
  showDelete,
}) => {
  const { t } = useTranslation();

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const [{ value: eventInfoLanguages }] = useField({
    name: EVENT_FIELDS.EVENT_INFO_LANGUAGES,
  });
  const [{ value: isRegistrationPlanned }] = useField({
    name: EVENT_FIELDS.IS_REGISTRATION_PLANNED,
  });

  return (
    <>
      <FieldRow
        notification={
          <PriceNotification className={styles.secondNotification} />
        }
      >
        <FieldWithButton
          button={
            showDelete && (
              <DeleteButton
                ariaLabel={t('event.form.buttonDeleteOffer')}
                disabled={!isEditingAllowed}
                onClick={onDelete}
              />
            )
          }
        >
          <>
            <FormGroup>
              <h3>{t('event.form.titleOfferPrice')}</h3>
              <MultiLanguageField
                disabled={!isEditingAllowed}
                labelKey={`event.form.labelOfferPrice`}
                languages={eventInfoLanguages}
                name={getFieldName(offerPath, EVENT_OFFER_FIELDS.OFFER_PRICE)}
                placeholderKey={`event.form.placeholderOfferPrice.${type}`}
                required={true}
              />
            </FormGroup>
            <FormGroup>
              <h3>{t('event.form.titleOfferInfoUrl')}</h3>
              <MultiLanguageField
                disabled={!isEditingAllowed}
                labelKey={`event.form.labelOfferInfoUrl`}
                languages={eventInfoLanguages}
                name={getFieldName(
                  offerPath,
                  EVENT_OFFER_FIELDS.OFFER_INFO_URL
                )}
                placeholderKey={`event.form.placeholderOfferInfoUrl`}
              />
            </FormGroup>
            <FormGroup>
              <h3>{t('event.form.titleOfferDescription')}</h3>
              <MultiLanguageField
                disabled={!isEditingAllowed}
                labelKey={`event.form.labelOfferDescription`}
                languages={eventInfoLanguages}
                name={getFieldName(
                  offerPath,
                  EVENT_OFFER_FIELDS.OFFER_DESCRIPTION
                )}
                placeholderKey={`event.form.placeholderOfferDescription`}
              />
            </FormGroup>
          </>
        </FieldWithButton>
      </FieldRow>

      {isRegistrationPlanned &&
        featureFlagUtils.isFeatureEnabled('WEB_STORE_INTEGRATION') && (
          <FormGroup>
            <OfferPriceGroups
              isEditingAllowed={isEditingAllowed}
              offerPath={offerPath}
            />
          </FormGroup>
        )}
    </>
  );
};

export default Offer;
