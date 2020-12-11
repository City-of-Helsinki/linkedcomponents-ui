import { Field, useField } from 'formik';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxGroupField from '../../../../common/components/formFields/CheckboxGroupField';
import InputRow from '../../../../common/components/inputRow/InputRow';
import LoadingSpinner from '../../../../common/components/loadingSpinner/LoadingSpinner';
import Notification from '../../../../common/components/notification/Notification';
import { INPUT_MAX_WIDTHS } from '../../../../constants';
import { useLanguagesQuery } from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import { OptionType } from '../../../../types';
import getLocalisedString from '../../../../utils/getLocalisedString';
import { EVENT_FIELDS, ORDERED_EVENT_INFO_LANGUAGES } from '../../constants';
import styles from '../../eventPage.module.scss';
import { sortLanguage } from '../../utils';
import InputWrapper from '../InputWrapper';

const LanguagesSection = () => {
  const { t } = useTranslation();
  const [{ value: eventType }] = useField({ name: EVENT_FIELDS.TYPE });
  const locale = useLocale();
  const { data, loading } = useLanguagesQuery();

  const eventInfoLanguageOptions: OptionType[] = ORDERED_EVENT_INFO_LANGUAGES.map(
    (type) => ({
      label: t(`form.language.${type}`),
      value: type,
    })
  );

  const inLanguageOptions: OptionType[] =
    data?.languages.data
      .map((language) => ({
        label: capitalize(getLocalisedString(language?.name, locale)),
        value: language?.id as string,
      }))
      .sort(sortLanguage) || [];

  return (
    <LoadingSpinner isLoading={loading}>
      <h3>{t(`event.form.titleInfoLanguages.${eventType}`)}</h3>
      <InputRow
        className={styles.noBottomMargin}
        info={
          <Notification
            label={t(`event.form.titleInfoLanguages.${eventType}`)}
            type="info"
          >
            <p>{t(`event.form.infoTextInfoLanguages.${eventType}`)}</p>
          </Notification>
        }
        infoColumns={4}
      >
        <InputWrapper maxWidth={INPUT_MAX_WIDTHS.MEDIUM}>
          <Field
            name={EVENT_FIELDS.EVENT_INFO_LANGUAGES}
            component={CheckboxGroupField}
            columns={3}
            min={1}
            options={eventInfoLanguageOptions}
          />
        </InputWrapper>
      </InputRow>

      <h3 className={styles.noTopMargin}>
        {t(`event.form.titleInLanguages.${eventType}`)}
      </h3>
      <InputRow
        info={
          <Notification
            label={t(`event.form.titleInLanguages.${eventType}`)}
            type="info"
          >
            <p>{t(`event.form.infoTextInLanguages.${eventType}`)}</p>
          </Notification>
        }
        infoColumns={4}
      >
        <InputWrapper maxWidth={INPUT_MAX_WIDTHS.MEDIUM}>
          <Field
            name={EVENT_FIELDS.IN_LANGUAGE}
            component={CheckboxGroupField}
            columns={3}
            min={1}
            options={inLanguageOptions}
            visibleOptionAmount={3}
          />
        </InputWrapper>
      </InputRow>
    </LoadingSpinner>
  );
};

export default LanguagesSection;
