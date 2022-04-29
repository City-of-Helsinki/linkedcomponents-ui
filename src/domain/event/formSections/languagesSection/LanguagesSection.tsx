import { Field, useField } from 'formik';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxGroupField from '../../../../common/components/formFields/CheckboxGroupField';
import LoadingSpinner from '../../../../common/components/loadingSpinner/LoadingSpinner';
import Notification from '../../../../common/components/notification/Notification';
import { ORDERED_LE_DATA_LANGUAGES } from '../../../../constants';
import { Language, useLanguagesQuery } from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import { OptionType } from '../../../../types';
import getLocalisedString from '../../../../utils/getLocalisedString';
import FieldColumn from '../../../app/layout/FieldColumn';
import FieldRow from '../../../app/layout/FieldRow';
import { EVENT_FIELDS } from '../../constants';
import { sortLanguage } from '../../utils';

interface Props {
  isEditingAllowed: boolean;
}

const LanguagesSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();
  const [{ value: eventType }] = useField({ name: EVENT_FIELDS.TYPE });
  const locale = useLocale();
  const { data, loading } = useLanguagesQuery();

  const eventInfoLanguageOptions: OptionType[] = ORDERED_LE_DATA_LANGUAGES.map(
    (type) => ({
      label: t(`form.language.${type}`),
      value: type,
    })
  );

  const inLanguageOptions: OptionType[] = (
    [...(data?.languages.data ?? /* istanbul ignore next */ [])] as Language[]
  )
    .sort(sortLanguage)
    .map((language) => ({
      label: capitalize(getLocalisedString(language?.name, locale)),
      value: language?.atId,
    }));

  return (
    <LoadingSpinner isLoading={loading}>
      <h3>{t(`event.form.titleInfoLanguages.${eventType}`)}</h3>
      <FieldRow
        notification={
          <Notification
            label={t(`event.form.titleInfoLanguages.${eventType}`)}
            type="info"
          >
            <p>{t(`event.form.infoTextInfoLanguages.${eventType}`)}</p>
          </Notification>
        }
      >
        <FieldColumn>
          <Field
            component={CheckboxGroupField}
            columns={3}
            disabled={!isEditingAllowed}
            min={1}
            name={EVENT_FIELDS.EVENT_INFO_LANGUAGES}
            options={eventInfoLanguageOptions}
          />
        </FieldColumn>
      </FieldRow>

      <h3>{t(`event.form.titleInLanguages.${eventType}`)}</h3>
      <FieldRow
        notification={
          <Notification
            label={t(`event.form.titleInLanguages.${eventType}`)}
            type="info"
          >
            <p>{t(`event.form.infoTextInLanguages.${eventType}`)}</p>
          </Notification>
        }
      >
        <FieldColumn>
          <Field
            component={CheckboxGroupField}
            columns={3}
            disabled={!isEditingAllowed}
            name={EVENT_FIELDS.IN_LANGUAGE}
            options={inLanguageOptions}
            visibleOptionAmount={3}
          />
        </FieldColumn>
      </FieldRow>
    </LoadingSpinner>
  );
};

export default LanguagesSection;
