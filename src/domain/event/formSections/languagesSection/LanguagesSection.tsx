import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import CheckboxGroupField from '../../../../common/components/formFields/checkboxGroupField/CheckboxGroupField';
import Notification from '../../../../common/components/notification/Notification';
import { ORDERED_LE_DATA_LANGUAGES } from '../../../../constants';
import { OptionType } from '../../../../types';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import useLanguageOptions from '../../../enrolment/hooks/useLanguageOptions';
import { EVENT_FIELDS } from '../../constants';
import styles from '../../eventPage.module.scss';

interface Props {
  isEditingAllowed: boolean;
}

const LanguagesSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();
  const [{ value: eventType }] = useField({ name: EVENT_FIELDS.TYPE });
  const inLanguageOptions = useLanguageOptions({ idKey: 'atId' });
  const eventInfoLanguageOptions: OptionType[] = ORDERED_LE_DATA_LANGUAGES.map(
    (type) => ({
      label: t(`form.language.${type}`),
      value: type,
    })
  );

  return (
    <Fieldset heading={t('event.form.sections.languages')} hideLegend>
      <h3>{t(`event.form.titleInfoLanguages.${eventType}`)}</h3>
      <FieldRow
        notification={
          <Notification
            className={styles.notificationForTitle}
            label={t(`event.form.titleInfoLanguages.${eventType}`)}
            type="info"
          >
            <p
              dangerouslySetInnerHTML={{
                __html: t(`event.form.infoTextInfoLanguages.${eventType}`),
              }}
            />
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
    </Fieldset>
  );
};

export default LanguagesSection;
