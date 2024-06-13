import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import CheckboxGroupField from '../../../../common/components/formFields/checkboxGroupField/CheckboxGroupField';
import HeadingWithTooltip from '../../../../common/components/headingWithTooltip/HeadingWithTooltip';
import Notification from '../../../../common/components/notification/Notification';
import { ORDERED_LE_DATA_LANGUAGES } from '../../../../constants';
import { OptionType } from '../../../../types';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import useLanguageOptions from '../../../language/hooks/useLanguageOptions';
import useUser from '../../../user/hooks/useUser';
import { EVENT_FIELDS } from '../../constants';
import styles from '../../eventPage.module.scss';
import {
  showNotificationInstructions,
  showTooltipInstructions,
} from '../../utils';
import InfoLanguagesInstructions from './infoLanguagesInstructions/InfoLanguagesInstructions';
import InLanguagesInstructions from './inLanguagesInstructions/InLanguageInstructions';

interface Props {
  isEditingAllowed: boolean;
}

const LanguagesSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();
  const { user } = useUser();

  const [{ value: eventType }] = useField<string>({ name: EVENT_FIELDS.TYPE });
  const inLanguageOptions = useLanguageOptions({ idKey: 'atId' });
  const eventInfoLanguageOptions: OptionType[] = ORDERED_LE_DATA_LANGUAGES.map(
    (type) => ({
      label: t(`form.language.${type}`),
      value: type,
    })
  );

  return (
    <Fieldset heading={t('event.form.sections.languages')} hideLegend>
      <HeadingWithTooltip
        heading={t(`event.form.titleInfoLanguages.${eventType}`)}
        showTooltip={showTooltipInstructions(user)}
        tag="h3"
        tooltipContent={<InfoLanguagesInstructions eventType={eventType} />}
        tooltipLabel={t(`event.form.titleInfoLanguages.${eventType}`)}
      />
      <FieldRow
        notification={
          showNotificationInstructions(user) ? (
            <Notification
              className={styles.notificationForTitle}
              label={t(`event.form.titleInfoLanguages.${eventType}`)}
              type="info"
            >
              <InfoLanguagesInstructions eventType={eventType} />
            </Notification>
          ) : undefined
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

      <HeadingWithTooltip
        heading={t(`event.form.titleInLanguages.${eventType}`)}
        showTooltip={showTooltipInstructions(user)}
        tag="h3"
        tooltipContent={<InLanguagesInstructions eventType={eventType} />}
        tooltipLabel={t(`event.form.titleInLanguages.${eventType}`)}
      />
      <FieldRow
        notification={
          showNotificationInstructions(user) ? (
            <Notification
              className={styles.notificationForTitle}
              label={t(`event.form.titleInLanguages.${eventType}`)}
              type="info"
            >
              <InLanguagesInstructions eventType={eventType} />
            </Notification>
          ) : undefined
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
          />
        </FieldColumn>
      </FieldRow>
    </Fieldset>
  );
};

export default LanguagesSection;
