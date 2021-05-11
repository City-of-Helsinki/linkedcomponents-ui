import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxGroupField from '../../../../common/components/formFields/CheckboxGroupField';
import Notification from '../../../../common/components/notification/Notification';
import useLocale from '../../../../hooks/useLocale';
import parseIdFromAtId from '../../../../utils/parseIdFromAtId';
import { getKeywordOption } from '../../../keywordSet/utils';
import { EVENT_FIELDS } from '../../constants';
import useEventFieldOptionsData from '../../hooks/useEventFieldOptionsData';
import FieldColumn from '../../layout/FieldColumn';
import FieldRow from '../../layout/FieldRow';

const AUDIENCE_ORDER = [
  'yso:p7179', // Vammaiset
  'yso:p4354', // Lapset
  'yso:p13050', // Lapsiperheet
  'yso:p6165', // Maahanmuuttajat
  'yso:p11617', // Nuoret
  'yso:p3128', // Yritykset
  'yso:p1393', // Järjestöt
  'yso:p12297', // Mielenterveyskuntoutujat
  'yso:p23886', // Päihdekuntoutujat
  'helsinki:aflfbatkwe', // Omaishoitoperheet
  'helsinki:aflfbat76e', // Palvelukeskuskortti
  'yso:p16485', // Koululaiset
  'yso:p20513', // Vauvaperheet
  'yso:p5590', // Aikuiset
  'yso:p16486', // Opiskelijat
  'yso:p2433', // Ikääntyneet
];

const AudienceSection: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const { audienceData } = useEventFieldOptionsData();

  const getKeywordIndex = (atId: string) => {
    const index = AUDIENCE_ORDER.indexOf(parseIdFromAtId(atId) as string);
    return index !== -1 ? index : AUDIENCE_ORDER.length;
  };

  const audienceOptions =
    audienceData?.keywordSet?.keywords
      ?.map((keyword) => getKeywordOption({ keyword, locale }))
      .sort((a, b) => getKeywordIndex(a.value) - getKeywordIndex(b.value)) ||
    [];

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
