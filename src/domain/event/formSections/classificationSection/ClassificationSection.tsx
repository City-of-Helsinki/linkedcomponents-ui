import { Field, useField } from 'formik';
import sortBy from 'lodash/sortBy';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxGroupField from '../../../../common/components/formFields/CheckboxGroupField';
import KeywordSelectorField from '../../../../common/components/formFields/KeywordSelectorField';
import Notification from '../../../../common/components/notification/Notification';
import useLocale from '../../../../hooks/useLocale';
import parseIdFromAtId from '../../../../utils/parseIdFromAtId';
import { REMOTE_PARTICIPATION_KEYWORD } from '../../../keyword/constants';
import { getKeywordOption } from '../../../keywordSet/utils';
import { INTERNET_PLACE_ID } from '../../../place/constants';
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
  const [{ value: eventLocation }] = useField({ name: EVENT_FIELDS.LOCATION });
  const [{ value: keywords }, , { setValue: setKeywords }] = useField<string[]>(
    {
      name: EVENT_FIELDS.KEYWORDS,
    }
  );
  const [{ value: mainCategories }, , { setValue: setMainCategories }] =
    useField<string[]>({
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

  // Internet location automatically implies "remote participation"
  React.useEffect(() => {
    if (
      parseIdFromAtId(eventLocation) === INTERNET_PLACE_ID &&
      !keywords.includes(REMOTE_PARTICIPATION_KEYWORD)
    ) {
      setKeywords([...keywords, REMOTE_PARTICIPATION_KEYWORD]);
    }
  }, [eventLocation, keywords, setKeywords]);

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
            disabledOptions={
              parseIdFromAtId(eventLocation) === INTERNET_PLACE_ID
                ? [REMOTE_PARTICIPATION_KEYWORD]
                : []
            }
            errorName={EVENT_FIELDS.MAIN_CATEGORIES}
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
            component={KeywordSelectorField}
            label={t(`event.form.labelKeywords`)}
            placeholder={t(`event.form.placeholderKeywords`)}
          />
        </FieldColumn>
      </FieldRow>
    </>
  );
};

export default ClassificationSection;
