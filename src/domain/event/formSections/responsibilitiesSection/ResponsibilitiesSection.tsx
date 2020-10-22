import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxField from '../../../../common/components/formFields/CheckboxField';
import UmbrellaEventSelectorField from '../../../../common/components/formFields/UmbrellaEventSelectorField';
import InputRow from '../../../../common/components/inputRow/InputRow';

const LanguagesSection = () => {
  const { t } = useTranslation();
  const [{ value: hasUmbrella }] = useField({ name: 'hasUmbrella' });
  const [{ value: isUmbrella }] = useField({ name: 'isUmbrella' });

  return (
    <>
      <h3>{t('event.form.titleUmrellaEvent')}</h3>
      <InputRow>
        <Field
          disabled={hasUmbrella}
          label={t('event.form.labelIsUmbrella')}
          name="isUmbrella"
          component={CheckboxField}
        />
        <Field
          disabled={isUmbrella}
          label={t('event.form.labelHasUmbrella')}
          name="hasUmbrella"
          component={CheckboxField}
        />
        {hasUmbrella && (
          <Field
            helper="Huom. Kattotapahtuma täytyy luoda ennen kuin voit lisätä sille alatapahtumia."
            label="Kattotapahtuma"
            name="umbrellaEvent"
            component={UmbrellaEventSelectorField}
          />
        )}
      </InputRow>
    </>
  );
};

export default LanguagesSection;
