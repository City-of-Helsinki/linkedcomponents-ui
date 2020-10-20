import { Field } from 'formik';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { useTranslation } from 'react-i18next';

import LanguageCheckboxGroupField from '../../../../common/components/formFields/LanguageCheckboxGroupField';
import InputRow from '../../../../common/components/inputRow/InputRow';
import LoadingSpinner from '../../../../common/components/loadingSpinner/LoadingSpinner';
import { useLanguagesQuery } from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import { OptionType } from '../../../../types';
import getLocalisedString from '../../../../utils/getLocalisedString';
import { EVENT_INFO_LANGUAGES } from '../../constants';
import { sortLanguage } from '../../utils';

const LanguagesSection = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { data, loading } = useLanguagesQuery();

  const eventInfoLanguageOptions: OptionType[] = EVENT_INFO_LANGUAGES.map(
    (type) => ({
      label: t(`event.language.${type}`),
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
      <h2>{t('event.form.titleEventInfoLanguages')}</h2>
      <InputRow>
        <Field
          name="eventInfoLanguages"
          component={LanguageCheckboxGroupField}
          options={eventInfoLanguageOptions}
        />
      </InputRow>

      <h2>{t('event.form.titleInLanguage')}</h2>
      <InputRow>
        <Field
          name="inLanguage"
          component={LanguageCheckboxGroupField}
          options={inLanguageOptions}
          visibleOptionAmount={3}
        />
      </InputRow>
    </LoadingSpinner>
  );
};

export default LanguagesSection;
