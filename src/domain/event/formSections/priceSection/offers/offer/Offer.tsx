import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DeleteButton from '../../../../../../common/components/deleteButton/DeleteButton';
import MultiLanguageField from '../../../../../../common/components/formFields/multiLanguageField/MultiLanguageField';
import FormGroup from '../../../../../../common/components/formGroup/FormGroup';
import HeadingWithTooltip from '../../../../../../common/components/headingWithTooltip/HeadingWithTooltip';
import { featureFlagUtils } from '../../../../../../utils/featureFlags';
import FieldRow from '../../../../../app/layout/fieldRow/FieldRow';
import useUser from '../../../../../user/hooks/useUser';
import { EVENT_FIELDS, EVENT_OFFER_FIELDS } from '../../../../constants';
import styles from '../../../../eventPage.module.scss';
import FieldWithButton from '../../../../layout/FieldWithButton';
import {
  showNotificationInstructions,
  showTooltipInstructions,
} from '../../../../utils';
import PriceInstructions from '../../priceInstructions/PriceInstructions';
import PriceNotification from '../../priceNotification/PriceNotification';
import OfferPriceGroups from './offerPriceGroups/OfferPriceGroups';

type Props = {
  isEditingAllowed: boolean;
  offerPath: string;
  onDelete: () => void;
  showDelete: boolean;
  showRegistrationPriceGroupFields: boolean;
};

const getFieldName = (offerPath: string, field: string) =>
  `${offerPath}.${field}`;

const Offer: React.FC<Props> = ({
  isEditingAllowed,
  offerPath,
  onDelete,
  showDelete,
  showRegistrationPriceGroupFields,
}) => {
  const { t } = useTranslation();
  const { user } = useUser();

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const [{ value: eventInfoLanguages }] = useField({
    name: EVENT_FIELDS.EVENT_INFO_LANGUAGES,
  });

  return (
    <>
      <FieldRow
        notification={
          showNotificationInstructions(user) ? (
            <PriceNotification className={styles.secondNotification} />
          ) : undefined
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
              <HeadingWithTooltip
                heading={t('event.form.titleOfferPrice')}
                showTooltip={showTooltipInstructions(user)}
                tag="h3"
                tooltipContent={<PriceInstructions eventType={type} />}
                tooltipLabel={t(`event.form.titlePriceInfo.${type}`)}
              />

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
          </>
        </FieldWithButton>
      </FieldRow>

      {showRegistrationPriceGroupFields &&
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
