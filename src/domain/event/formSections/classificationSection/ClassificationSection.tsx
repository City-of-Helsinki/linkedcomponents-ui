import { Field, useField } from 'formik';
import sortBy from 'lodash/sortBy';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxGroupField from '../../../../common/components/formFields/checkboxGroupField/CheckboxGroupField';
import KeywordSelectorField from '../../../../common/components/formFields/keywordSelectorField/KeywordSelectorField';
import Notification from '../../../../common/components/notification/Notification';
import useLocale from '../../../../hooks/useLocale';
import parseIdFromAtId from '../../../../utils/parseIdFromAtId';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import { REMOTE_PARTICIPATION_KEYWORD } from '../../../keyword/constants';
import { getKeywordOption } from '../../../keywordSet/utils';
import { INTERNET_PLACE_ID } from '../../../place/constants';
import { EVENT_FIELDS } from '../../constants';
import styles from '../../eventPage.module.scss';
import useEventFieldOptionsData from '../../hooks/useEventFieldOptionsData';

interface Props {
  isEditingAllowed: boolean;
}

const ClassificationSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const [{ value: eventLocation }] = useField({ name: EVENT_FIELDS.LOCATION });
  const [{ value: keywords }, , { setValue: setKeywords }] = useField<string[]>(
    { name: EVENT_FIELDS.KEYWORDS }
  );
  const [, , { setValue: setMainCategories }] = useField<string[]>({
    name: EVENT_FIELDS.MAIN_CATEGORIES,
  });

  const { topicsData } = useEventFieldOptionsData(type);

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

  React.useEffect(() => {
    // Set main categories to validate that at least one main category is selected
    setMainCategories(keywordOptions?.map((k) => k.value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywordOptions]);

  // Internet location automatically implies "remote participation"
  React.useEffect(() => {
    if (
      parseIdFromAtId(eventLocation) === INTERNET_PLACE_ID &&
      !keywords.includes(REMOTE_PARTICIPATION_KEYWORD)
    ) {
      setKeywords([...keywords, REMOTE_PARTICIPATION_KEYWORD]);
    }
  }, [eventLocation, keywords, setKeywords]);

  const disabledMainCategoryOptions = React.useMemo(
    () =>
      parseIdFromAtId(eventLocation) === INTERNET_PLACE_ID
        ? [REMOTE_PARTICIPATION_KEYWORD]
        : [],
    [eventLocation]
  );

  return (
    <>
      <h3>{t(`event.form.titleMainCategories`)}</h3>
      <FieldRow
        notification={
          <Notification
            className={styles.notificationForTitle}
            label={t(`event.form.notificationTitleMainCategories.${type}`)}
            type="info"
          >
            <p>{t(`event.form.infoTextMainCategories.${type}`)}</p>
          </Notification>
        }
      >
        <FieldColumn>
          <Field
            component={CheckboxGroupField}
            columns={2}
            disabled={!isEditingAllowed}
            disabledOptions={disabledMainCategoryOptions}
            errorName={EVENT_FIELDS.MAIN_CATEGORIES}
            label={t(`event.form.titleMainCategories`)}
            options={keywordOptions}
            name={EVENT_FIELDS.KEYWORDS}
            visibleOptionAmount={10}
          />
        </FieldColumn>
      </FieldRow>

      <h3>{t(`event.form.titleKeywords`)}</h3>
      <FieldRow
        notification={
          <Notification
            className={styles.notificationForTitle}
            label={t(`event.form.titleKeywords`)}
            type="info"
          >
            <p>{t(`event.form.infoTextKeywords.${type}`)}</p>
          </Notification>
        }
      >
        <FieldColumn>
          <Field
            component={KeywordSelectorField}
            disabled={!isEditingAllowed}
            label={t(`event.form.labelKeywords`)}
            name={EVENT_FIELDS.KEYWORDS}
            placeholder={t(`event.form.placeholderKeywords`)}
          />
        </FieldColumn>
      </FieldRow>
    </>
  );
};

export default ClassificationSection;
