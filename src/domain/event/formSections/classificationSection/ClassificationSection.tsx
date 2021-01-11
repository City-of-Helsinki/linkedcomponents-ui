import { Field, useField } from 'formik';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxGroupField from '../../../../common/components/formFields/CheckboxGroupField';
import KeywordSelectorFields from '../../../../common/components/formFields/KeywordSelectorFields';
import InputRow from '../../../../common/components/inputRow/InputRow';
import Notification from '../../../../common/components/notification/Notification';
import { INCLUDE, INPUT_MAX_WIDTHS, KEYWORD_SETS } from '../../../../constants';
import { useKeywordSetQuery } from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import getLocalisedString from '../../../../utils/getLocalisedString';
import getPathBuilder from '../../../../utils/getPathBuilder';
import { keywordSetPathBuilder } from '../../../keywordSet/utils';
import { EVENT_FIELDS } from '../../constants';
import styles from '../../eventPage.module.scss';
import InputWrapper from '../InputWrapper';

const ClassificationSection = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const { data } = useKeywordSetQuery({
    variables: {
      createPath: getPathBuilder(keywordSetPathBuilder),
      id: KEYWORD_SETS.TOPICS,
      include: [INCLUDE.KEYWORDS],
    },
  });

  const keywordOptions =
    data?.keywordSet?.keywords?.map((keyword) => ({
      label: capitalize(getLocalisedString(keyword?.name, locale)),
      value: keyword?.atId,
    })) || [];

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });

  return (
    <>
      <h3>{t(`event.form.titleMainCategories`)}</h3>
      <InputRow
        info={
          <Notification
            label={t(`event.form.notificationTitleMainCategories.${type}`)}
            type="info"
          >
            <p>{t(`event.form.infoTextMainCategories`)}</p>
          </Notification>
        }
        infoColumns={4}
      >
        <InputWrapper maxWidth={INPUT_MAX_WIDTHS.MEDIUM}>
          <Field
            name={EVENT_FIELDS.KEYWORDS}
            component={CheckboxGroupField}
            columns={2}
            options={keywordOptions}
            visibleOptionAmount={10}
          />
        </InputWrapper>
      </InputRow>

      <h3>{t(`event.form.titleKeywords`)}</h3>
      <InputRow
        info={
          <Notification
            className={styles.notification}
            label={t(`event.form.titleKeywords`)}
            type="info"
          >
            <p>{t(`event.form.infoTextKeywords.${type}`)}</p>
          </Notification>
        }
        infoColumns={4}
      >
        <InputWrapper maxWidth={INPUT_MAX_WIDTHS.MEDIUM}>
          <Field
            name={EVENT_FIELDS.KEYWORDS}
            component={KeywordSelectorFields}
            label={t(`event.form.labelKeywords`)}
            placeholder={t(`event.form.placeholderKeywords`)}
          />
        </InputWrapper>
      </InputRow>
    </>
  );
};

export default ClassificationSection;
