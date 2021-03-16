import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DeleteButton from '../../../../common/components/deleteButton/DeleteButton';
import MultiLanguageField from '../../../../common/components/formFields/MultiLanguageField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import Notification from '../../../../common/components/notification/Notification';
import { EVENT_FIELDS } from '../../constants';
import styles from '../../eventPage.module.scss';
import FieldRow from '../../layout/FieldRow';
import FieldWithButton from '../../layout/FieldWithButton';

type Props = {
  offerPath: string;
  onDelete: () => void;
  showInstructions?: boolean;
  type: string;
};

const getFieldName = (offerPath: string, field: string) =>
  `${offerPath}.${field}`;

const Offer: React.FC<Props> = ({
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
              label={t('event.form.buttonDeleteOffer')}
              onClick={onDelete}
            />
          }
        >
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
              />
            </FormGroup>
            <FormGroup>
              <h3>{t('event.form.titleOfferDescription')}</h3>
              <MultiLanguageField
                name={getFieldName(offerPath, EVENT_FIELDS.OFFER_DESCRIPTION)}
                labelKey={`event.form.labelOfferDescription`}
                languages={eventInfoLanguages}
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
