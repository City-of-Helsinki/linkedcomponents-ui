import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxField from '../../../../common/components/formFields/CheckboxField';
import MultiLanguageField from '../../../../common/components/formFields/MultiLanguageField';
import UmbrellaEventSelectorField from '../../../../common/components/formFields/UmbrellaEventSelectorField';
import InputRow from '../../../../common/components/inputRow/InputRow';
import { EVENT_FIELDS } from '../../constants';

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
      <InputRow>
        <MultiLanguageField
          labelKey={`event.form.labelProvider.${type}`}
          languages={eventInfoLanguages}
          name={EVENT_FIELDS.PROVIDER}
          placeholderKey={t(`event.form.placeholderProvider.${type}`)}
        />
      </InputRow>
      <h3>{t('event.form.titleUmrellaEvent')}</h3>
      <InputRow>
        <Field
          disabled={hasUmbrella}
          label={t(`event.form.labelIsUmbrella.${type}`)}
          name={EVENT_FIELDS.IS_UMBRELLA}
          component={CheckboxField}
        />
      </InputRow>
      <InputRow>
        <Field
          disabled={isUmbrella}
          label={t(`event.form.labelHasUmbrella.${type}`)}
          name={EVENT_FIELDS.HAS_UMBRELLA}
          component={CheckboxField}
        />
      </InputRow>
      <InputRow>
        {hasUmbrella && (
          <Field
            helper={t('event.form.helperUmbrellaEvent')}
            label={t('event.form.labelUmbrellaEvent')}
            name={EVENT_FIELDS.UMBRELLA_EVENT}
            component={UmbrellaEventSelectorField}
          />
        )}
      </InputRow>
    </>
  );
};

export default LanguagesSection;
