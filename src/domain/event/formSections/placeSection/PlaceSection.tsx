import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import MultiLanguageField from '../../../../common/components/formFields/MultiLanguageField';
import InputRow from '../../../../common/components/inputRow/InputRow';
import Notification from '../../../../common/components/notification/Notification';
import { INPUT_MAX_WIDTHS } from '../../../../constants';
import { EVENT_FIELDS } from '../../constants';
import InputWrapper from '../InputWrapper';

const PlaceSection = () => {
  const { t } = useTranslation();

  const [{ value: eventInfoLanguages }] = useField({
    name: EVENT_FIELDS.EVENT_INFO_LANGUAGES,
  });

  return (
    <>
      <h3>{t(`event.form.titleLocationExtraInfo`)}</h3>
      <InputRow
        info={<Notification label={'TODO'} type="info"></Notification>}
        infoWidth={4}
      >
        <InputWrapper
          columns={6}
          inputColumns={6}
          maxWidth={INPUT_MAX_WIDTHS.LARGE}
        >
          <MultiLanguageField
            labelKey={`event.form.labelLocationExtraInfo`}
            languages={eventInfoLanguages}
            name={EVENT_FIELDS.LOCATION_EXTRA_INFO}
            placeholderKey={`event.form.placeholderLocationExtraInfo`}
          />
        </InputWrapper>
      </InputRow>
    </>
  );
};

export default PlaceSection;
