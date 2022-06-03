import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DeleteButton from '../../../../../../common/components/deleteButton/DeleteButton';
import MultiLanguageField from '../../../../../../common/components/formFields/multiLanguageField/MultiLanguageField';
import FormGroup from '../../../../../../common/components/formGroup/FormGroup';
import Notification from '../../../../../../common/components/notification/Notification';
import FieldRow from '../../../../../app/layout/fieldRow/FieldRow';
import { EVENT_FIELDS } from '../../../../constants';
import styles from '../../../../eventPage.module.scss';
import FieldWithButton from '../../../../layout/FieldWithButton';

type Props = {
  isEditingAllowed: boolean;
  offerPath: string;
  onDelete: () => void;
  showInstructions?: boolean;
  type: string;
};

const getFieldName = (offerPath: string, field: string) =>
  `${offerPath}.${field}`;

const Offer: React.FC<Props> = ({
  isEditingAllowed,
  offerPath,
  onDelete,
  showInstructions,
  type,
}) => {
  const { t } = useTranslation();

  const [{ value: eventInfoLanguages }] = useField({
    name: EVENT_FIELDS.EVENT_INFO_LANGUAGES,
  });

  return (
    <>
      <h3>{t('event.form.titleOfferPrice')}</h3>
      <FieldRow
        notification={
          showInstructions ? (
            <Notification
              className={styles.notification}
              label={t(`event.form.notificationTitleOffers`)}
              type="info"
            >
              <p>{t(`event.form.infoTextOffers1.${type}`)}</p>
              <p>{t(`event.form.infoTextOffers2.${type}`)}</p>
            </Notification>
          ) : undefined
        }
      >
        <FieldWithButton
          button={
            <DeleteButton
              ariaLabel={t('event.form.buttonDeleteOffer')}
              disabled={!isEditingAllowed}
              onClick={onDelete}
            />
          }
        >
          <>
            <FormGroup>
              <MultiLanguageField
                disabled={!isEditingAllowed}
                labelKey={`event.form.labelOfferPrice`}
                languages={eventInfoLanguages}
                name={getFieldName(offerPath, EVENT_FIELDS.OFFER_PRICE)}
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
                name={getFieldName(offerPath, EVENT_FIELDS.OFFER_INFO_URL)}
                placeholderKey={`event.form.placeholderOfferInfoUrl`}
              />
            </FormGroup>
            <FormGroup>
              <h3>{t('event.form.titleOfferDescription')}</h3>
              <MultiLanguageField
                disabled={!isEditingAllowed}
                labelKey={`event.form.labelOfferDescription`}
                languages={eventInfoLanguages}
                name={getFieldName(offerPath, EVENT_FIELDS.OFFER_DESCRIPTION)}
                placeholderKey={`event.form.placeholderOfferDescription`}
              />
            </FormGroup>
          </>
        </FieldWithButton>
      </FieldRow>
    </>
  );
};

export default Offer;
