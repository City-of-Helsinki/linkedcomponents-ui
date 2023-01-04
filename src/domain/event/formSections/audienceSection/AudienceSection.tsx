import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import CheckboxGroupField from '../../../../common/components/formFields/checkboxGroupField/CheckboxGroupField';
import Notification from '../../../../common/components/notification/Notification';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import { EVENT_FIELDS } from '../../constants';
import styles from '../../eventPage.module.scss';
import useAudienceOptions from '../../hooks/useAudienceOptions';

interface Props {
  isEditingAllowed: boolean;
}

const AudienceSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  const audienceOptions = useAudienceOptions();

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });

  return (
    <Fieldset heading={t('event.form.sections.audience')} hideLegend>
      <FieldRow
        notification={
          <Notification
            className={styles.notificationForTitle}
            label={t(`event.form.titleAudience`)}
            type="info"
          >
            <p>{t(`event.form.infoTextAudience.${type}`)}</p>
          </Notification>
        }
      >
        <FieldColumn>
          <Field
            component={CheckboxGroupField}
            columns={2}
            disabled={!isEditingAllowed}
            label={t(`event.form.titleAudience`)}
            name={EVENT_FIELDS.AUDIENCE}
            options={audienceOptions}
            visibleOptionAmount={10}
          />
        </FieldColumn>
      </FieldRow>
    </Fieldset>
  );
};

export default AudienceSection;
