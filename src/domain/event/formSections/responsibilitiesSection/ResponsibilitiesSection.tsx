import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useDeepCompareEffect from 'use-deep-compare-effect';

import CheckboxField from '../../../../common/components/formFields/CheckboxField';
import MultiLanguageField from '../../../../common/components/formFields/MultiLanguageField';
import UmbrellaEventSelectorField from '../../../../common/components/formFields/UmbrellaEventSelectorField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import { INPUT_MAX_WIDTHS } from '../../../../constants';
import { EVENT_FIELDS } from '../../constants';
import InputWrapper from '../InputWrapper';

const LanguagesSection = () => {
  const { t } = useTranslation();
  const [{ value: type }] = useField({
    name: EVENT_FIELDS.TYPE,
  });
  const [{ value: hasUmbrella }] = useField({
    name: EVENT_FIELDS.HAS_UMBRELLA,
  });
  const [{ value: isUmbrella }, , { setValue: setIsUmbrella }] = useField({
    name: EVENT_FIELDS.IS_UMBRELLA,
  });
  const [{ value: eventTimes }] = useField<string[]>({
    name: EVENT_FIELDS.EVENT_TIMES,
  });
  const [{ value: recurringEvents }] = useField<string[]>({
    name: EVENT_FIELDS.RECURRING_EVENTS,
  });
  const [{ value: eventInfoLanguages }] = useField({
    name: EVENT_FIELDS.EVENT_INFO_LANGUAGES,
  });

  useDeepCompareEffect(() => {
    // Set is umbrella to false if event has more than one event time
    if ((eventTimes.length || recurringEvents.length) && isUmbrella) {
      setIsUmbrella(false);
    }
  }, [{ eventTimes, isUmbrella, recurringEvents }]);

  const disabledIsUmbrella: boolean =
    hasUmbrella || eventTimes.length || recurringEvents.length;

  return (
    <>
      <InputWrapper maxWidth={INPUT_MAX_WIDTHS.MEDIUM}>
        <h3>{t('event.form.titlePersonsInCharge')}</h3>
        <MultiLanguageField
          labelKey={`event.form.labelProvider.${type}`}
          languages={eventInfoLanguages}
          name={EVENT_FIELDS.PROVIDER}
          placeholder={t(`event.form.placeholderProvider.${type}`)}
        />
        <h3>{t('event.form.titleUmrellaEvent')}</h3>
        <FormGroup>
          <Field
            disabled={disabledIsUmbrella}
            label={t(`event.form.labelIsUmbrella.${type}`)}
            name={EVENT_FIELDS.IS_UMBRELLA}
            component={CheckboxField}
            title={disabledIsUmbrella && t('event.form.tooltipEventIsUmbrella')}
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
              name={EVENT_FIELDS.SUPER_EVENT}
              component={UmbrellaEventSelectorField}
            />
          </FormGroup>
        )}
      </InputWrapper>
    </>
  );
};

export default LanguagesSection;
