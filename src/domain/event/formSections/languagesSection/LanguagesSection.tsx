import { Field, useField } from 'formik';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import CheckboxGroupField from '../../../../common/components/formFields/checkboxGroupField/CheckboxGroupField';
import LoadingSpinner from '../../../../common/components/loadingSpinner/LoadingSpinner';
import Notification from '../../../../common/components/notification/Notification';
import { ORDERED_LE_DATA_LANGUAGES } from '../../../../constants';
import { useLanguagesQuery } from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import { OptionType } from '../../../../types';
import getLocalisedString from '../../../../utils/getLocalisedString';
import getValue from '../../../../utils/getValue';
import skipFalsyType from '../../../../utils/skipFalsyType';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import { EVENT_FIELDS } from '../../constants';
import styles from '../../eventPage.module.scss';
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

  const inLanguageOptions: OptionType[] = [
    ...getValue(data?.languages.data, []),
  ]
    .filter(skipFalsyType)
    .sort(sortLanguage)
    .map((language) => ({
      label: capitalize(getLocalisedString(language?.name, locale)),
      value: language?.atId,
    }));

  return (
    <Fieldset heading={t('event.form.sections.languages')} hideLegend>
      <LoadingSpinner isLoading={loading}>
        <h3>{t(`event.form.titleInfoLanguages.${eventType}`)}</h3>
        <FieldRow
          notification={
            <Notification
              className={styles.notificationForTitle}
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
              label={t(`event.form.titleInfoLanguages.${eventType}`)}
              min={1}
              name={EVENT_FIELDS.EVENT_INFO_LANGUAGES}
              options={eventInfoLanguageOptions}
              required
            />
          </FieldColumn>
        </FieldRow>

        <h3>{t(`event.form.titleInLanguages.${eventType}`)}</h3>
        <FieldRow
          notification={
            <Notification
              className={styles.notificationForTitle}
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
              label={t(`event.form.titleInLanguages.${eventType}`)}
              name={EVENT_FIELDS.IN_LANGUAGE}
              options={inLanguageOptions}
              visibleOptionAmount={10}
            />
          </FieldColumn>
        </FieldRow>
      </LoadingSpinner>
    </Fieldset>
  );
};

export default LanguagesSection;
