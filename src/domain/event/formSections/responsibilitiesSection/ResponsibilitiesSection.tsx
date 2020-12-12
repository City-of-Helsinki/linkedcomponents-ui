import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxField from '../../../../common/components/formFields/CheckboxField';
import MultiLanguageField from '../../../../common/components/formFields/MultiLanguageField';
import UmbrellaEventSelectorField from '../../../../common/components/formFields/UmbrellaEventSelectorField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import InputRow from '../../../../common/components/inputRow/InputRow';
import Notification from '../../../../common/components/notification/Notification';
import { INPUT_MAX_WIDTHS } from '../../../../constants';
import { EVENT_FIELDS } from '../../constants';
import eventPageStyles from '../../eventPage.module.scss';
import InputWrapper from '../InputWrapper';
import styles from './responsibilitiesSection.module.scss';

const LanguagesSection = () => {
  const { t } = useTranslation();
  const [{ value: type }] = useField({
    name: EVENT_FIELDS.TYPE,
  });
  const [{ value: hasUmbrella }] = useField({
    name: EVENT_FIELDS.HAS_UMBRELLA,
  });
  const [{ value: isUmbrella }] = useField({ name: EVENT_FIELDS.IS_UMBRELLA });
  const [{ value: eventInfoLanguages }] = useField({
    name: EVENT_FIELDS.EVENT_INFO_LANGUAGES,
  });

  return (
    <>
      <h3>{t('event.form.titlePersonsInCharge')}</h3>
      <InputRow
        info={
          <div className={styles.notifications}>
            <Notification
              label="Järjestäjä"
              type="info"
              className={eventPageStyles.notification}
            >
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
            </Notification>
            <Notification label="Julkaisija" type="info">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
            </Notification>
          </div>
        }
        infoColumns={4}
      >
        <InputWrapper maxWidth={INPUT_MAX_WIDTHS.MEDIUM}>
          <MultiLanguageField
            labelKey={`event.form.labelProvider.${type}`}
            languages={eventInfoLanguages}
            name={EVENT_FIELDS.PROVIDER}
            placeholder={t(`event.form.placeholderProvider.${type}`)}
          />
        </InputWrapper>
      </InputRow>

      <h3>Kattotapahtuma</h3>
      <InputRow
        info={
          <Notification label="Kattotapahtuma" type="info">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
          </Notification>
        }
        infoColumns={4}
      >
        <InputWrapper maxWidth={INPUT_MAX_WIDTHS.MEDIUM}>
          <FormGroup>
            <Field
              disabled={hasUmbrella}
              label={t(`event.form.labelIsUmbrella.${type}`)}
              name={EVENT_FIELDS.IS_UMBRELLA}
              component={CheckboxField}
            />
          </FormGroup>
          <FormGroup>
            <Field
              disabled={isUmbrella}
              label={t(`event.form.labelHasUmbrella.${type}`)}
              name={EVENT_FIELDS.HAS_UMBRELLA}
              component={CheckboxField}
            />
          </FormGroup>
          {hasUmbrella && (
            <FormGroup>
              <Field
                helper={t('event.form.helperUmbrellaEvent')}
                label={t('event.form.labelUmbrellaEvent')}
                name={EVENT_FIELDS.UMBRELLA_EVENT}
                component={UmbrellaEventSelectorField}
              />
            </FormGroup>
          )}
        </InputWrapper>
      </InputRow>
    </>
  );
};

export default LanguagesSection;
