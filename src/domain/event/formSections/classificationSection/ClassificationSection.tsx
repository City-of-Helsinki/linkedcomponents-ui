import { Field, useField } from 'formik';
import sortBy from 'lodash/sortBy';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxGroupField from '../../../../common/components/formFields/CheckboxGroupField';
import KeywordSelectorFields from '../../../../common/components/formFields/KeywordSelectorFields';
import Notification from '../../../../common/components/notification/Notification';
import useLocale from '../../../../hooks/useLocale';
import { getKeywordOption } from '../../../keywordSet/utils';
import { EVENT_FIELDS } from '../../constants';
import styles from '../../eventPage.module.scss';
import useEventFieldOptionsData from '../../hooks/useEventFieldOptionsData';
import FieldColumn from '../../layout/FieldColumn';
import FieldRow from '../../layout/FieldRow';

const ClassificationSection: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const { topicsData } = useEventFieldOptionsData();

  const keywordOptions = React.useMemo(
    () =>
      sortBy(
        topicsData?.keywordSet?.keywords?.map((keyword) =>
          getKeywordOption({ keyword, locale })
        ) || [],
        'label'
      ),
    [locale, topicsData]
  );

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const [
    { value: mainCategories },
    ,
    { setValue: setMainCategories },
  ] = useField({
    name: EVENT_FIELDS.MAIN_CATEGORIES,
  });

  React.useEffect(() => {
    // Set main categories to validate that at least one main category is selected
    setMainCategories(keywordOptions.map((option) => option.value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywordOptions]);

  React.useEffect(() => {
    if (!mainCategories.length && keywordOptions.length) {
      setMainCategories(keywordOptions.map((option) => option.value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainCategories]);

  return (
    <>
      <h3>{t(`event.form.titleMainCategories`)}</h3>
      <FieldRow
        notification={
          <Notification
            label={t(`event.form.notificationTitleMainCategories.${type}`)}
            type="info"
          >
            <p>{t(`event.form.infoTextMainCategories.${type}`)}</p>
          </Notification>
        }
      >
        <FieldColumn>
          <Field
            name={EVENT_FIELDS.KEYWORDS}
            component={CheckboxGroupField}
            columns={2}
            id={EVENT_FIELDS.MAIN_CATEGORIES}
            options={keywordOptions}
            visibleOptionAmount={10}
          />
        </FieldColumn>
      </FieldRow>

      <h3>{t(`event.form.titleKeywords`)}</h3>
      <FieldRow
        notification={
          <Notification
            className={styles.notification}
            label={t(`event.form.titleKeywords`)}
            type="info"
          >
            <p>{t(`event.form.infoTextKeywords.${type}`)}</p>
          </Notification>
        }
      >
        <FieldColumn>
          <Field
            name={EVENT_FIELDS.KEYWORDS}
            component={KeywordSelectorFields}
            label={t(`event.form.labelKeywords`)}
            placeholder={t(`event.form.placeholderKeywords`)}
          />
        </FieldColumn>
      </FieldRow>
    </>
  );
};

export default ClassificationSection;
