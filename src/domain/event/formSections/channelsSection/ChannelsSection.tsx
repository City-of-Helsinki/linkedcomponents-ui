import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import MultiLanguageField from '../../../../common/components/formFields/MultiLanguageField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import Notification from '../../../../common/components/notification/Notification';
import { EVENT_FIELDS } from '../../constants';
import FieldColumn from '../../layout/FieldColumn';
import FieldRow from '../../layout/FieldRow';
import ExternalLinks from './externalLinks/ExternalLinks';

const ChannelsSection: React.FC = () => {
  const { t } = useTranslation();
  const [{ value: type }] = useField(EVENT_FIELDS.TYPE);
  const [{ value: eventInfoLanguages }] = useField({
    name: EVENT_FIELDS.EVENT_INFO_LANGUAGES,
  });

  return (
    <>
      <h3>{t(`event.form.titleInfoUrl.${type}`)}</h3>
      <FieldRow>
        <FieldColumn>
          <FormGroup>
            <MultiLanguageField
              languages={eventInfoLanguages}
              labelKey={`event.form.labelInfoUrl.${type}`}
              name={EVENT_FIELDS.INFO_URL}
              placeholderKey={`event.form.placeholderInfoUrl.${type}`}
            />
          </FormGroup>
        </FieldColumn>
      </FieldRow>
      <h3>{t(`event.form.titleSocialMedia.${type}`)}</h3>
      <FieldRow
        notification={
          <Notification
            label={t(`event.form.titleSocialMedia.${type}`)}
            type="info"
          >
            <p>{t(`event.form.infoTextSocialMedia.${type}`)}</p>
          </Notification>
        }
      >
        <ExternalLinks />
      </FieldRow>
    </>
  );
};

export default ChannelsSection;
