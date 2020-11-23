import { Field, useField } from 'formik';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxGroupField from '../../../../common/components/formFields/CheckboxGroupField';
import InputRow from '../../../../common/components/inputRow/InputRow';
import Notification from '../../../../common/components/notification/Notification';
import { INCLUDE, INPUT_MAX_WIDTHS, KEYWORD_SETS } from '../../../../constants';
import { useKeywordSetQuery } from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import getLocalisedString from '../../../../utils/getLocalisedString';
import getPathBuilder from '../../../../utils/getPathBuilder';
import { keywordSetPathBuilder } from '../../../keywordSet/utils';
import { EVENT_FIELDS } from '../../constants';
import InputWrapper from '../InputWrapper';

const TargetGroupSection = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const { data } = useKeywordSetQuery({
    variables: {
      createPath: getPathBuilder(keywordSetPathBuilder),
      id: KEYWORD_SETS.AUDIENCES,
      include: [INCLUDE.KEYWORDS],
    },
  });

  const audienceOptions =
    data?.keywordSet?.keywords?.map((keyword) => ({
      label: capitalize(getLocalisedString(keyword?.name, locale)),
      value: keyword?.atId,
    })) || [];

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });

  return (
    <>
      <h3>{t(`event.form.titleAudience`)}</h3>
      <InputRow
        info={
          <Notification label={t(`event.form.titleAudience`)} type="info">
            <p>{t(`event.form.infoTextAudience.${type}`)}</p>
          </Notification>
        }
        infoWidth={4}
      >
        <InputWrapper
          columns={6}
          inputColumns={6}
          maxWidth={INPUT_MAX_WIDTHS.MEDIUM}
        >
          <Field
            name={EVENT_FIELDS.AUDIENCE}
            component={CheckboxGroupField}
            columns={2}
            options={audienceOptions}
            visibleOptionAmount={10}
          />
        </InputWrapper>
      </InputRow>
    </>
  );
};

export default TargetGroupSection;
