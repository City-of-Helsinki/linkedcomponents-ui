import { Field, useField } from 'formik';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxGroupField from '../../../../common/components/formFields/CheckboxGroupField';
import Notification from '../../../../common/components/notification/Notification';
import useLocale from '../../../../hooks/useLocale';
import getLocalisedString from '../../../../utils/getLocalisedString';
import { EVENT_FIELDS } from '../../constants';
import useEventFieldOptionsData from '../../hooks/useEventFieldOptionsData';
import FieldColumn from '../../layout/FieldColumn';
import FieldRow from '../../layout/FieldRow';

const AudienceSection = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const { audienceData } = useEventFieldOptionsData();

  const audienceOptions =
    audienceData?.keywordSet?.keywords?.map((keyword) => ({
      label: capitalize(getLocalisedString(keyword?.name, locale)),
      value: keyword?.atId,
    })) || [];

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });

  return (
    <>
      <FieldRow
        notification={
          <Notification label={t(`event.form.titleAudience`)} type="info">
            <p>{t(`event.form.infoTextAudience.${type}`)}</p>
          </Notification>
        }
      >
        <FieldColumn>
          <Field
            name={EVENT_FIELDS.AUDIENCE}
            component={CheckboxGroupField}
            columns={2}
            options={audienceOptions}
            visibleOptionAmount={10}
          />
        </FieldColumn>
      </FieldRow>
    </>
  );
};

export default AudienceSection;
