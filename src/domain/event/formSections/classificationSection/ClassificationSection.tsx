import { Field, useField } from 'formik';
import sortBy from 'lodash/sortBy';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import CheckboxGroupField from '../../../../common/components/formFields/checkboxGroupField/CheckboxGroupField';
import KeywordSelectorField from '../../../../common/components/formFields/keywordSelectorField/KeywordSelectorField';
import HeadingWithTooltip from '../../../../common/components/headingWithTooltip/HeadingWithTooltip';
import Notification from '../../../../common/components/notification/Notification';
import useLocale from '../../../../hooks/useLocale';
import getValue from '../../../../utils/getValue';
import parseIdFromAtId from '../../../../utils/parseIdFromAtId';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import { REMOTE_PARTICIPATION_KEYWORD } from '../../../keyword/constants';
import { getKeywordOption } from '../../../keywordSet/utils';
import { KASKO_ORGANIZATION_ID } from '../../../organization/constants';
import useOrganizationDecendants from '../../../organization/hooks/useOrganizationDecendants';
import { isAdminUserInKaskoOrganization } from '../../../organization/utils';
import { INTERNET_PLACE_ID } from '../../../place/constants';
import useUser from '../../../user/hooks/useUser';
import { EVENT_FIELDS, EVENT_TYPE } from '../../constants';
import styles from '../../eventPage.module.scss';
import useEventFieldOptionsData from '../../hooks/useEventFieldOptionsData';
import {
  showNotificationInstructions,
  showTooltipInstructions,
} from '../../utils';
import CrossInstitutionalStudiesSection from './CrossInstitutionalStudiesSection/CrossInstitutionalStudiesSection';
import KeywordsInstructions from './keywordsInstructions/KeywordsInstructions';
import MainCategoriesInstructions from './mainCategoriesInstructions/MainCategoriesInstructions';

interface Props {
  isEditingAllowed: boolean;
}

const ClassificationSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { user } = useUser();

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const [{ value: eventLocation }] = useField({ name: EVENT_FIELDS.LOCATION });
  const [{ value: keywords }, , { setValue: setKeywords }] = useField<string[]>(
    { name: EVENT_FIELDS.KEYWORDS }
  );

  const { topicsData } = useEventFieldOptionsData(type);
  const {
    loading: loadingKaskoOrganizations,
    organizationDecendants: kaskoOrganizations,
  } = useOrganizationDecendants(KASKO_ORGANIZATION_ID);

  const keywordOptions = React.useMemo(
    () =>
      sortBy(
        getValue(
          topicsData?.keywordSet?.keywords?.map((keyword) =>
            getKeywordOption({ keyword, locale })
          ),
          []
        ),
        'label'
      ),
    [locale, topicsData]
  );

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

  const eventTypeIsCourse = type === EVENT_TYPE.Course;

  const isUserAdminInKaskoOrganization = isAdminUserInKaskoOrganization({
    kaskoOrganizations,
    user,
  });

  return (
    <Fieldset heading={t('event.form.sections.classification')} hideLegend>
      <HeadingWithTooltip
        heading={t(`event.form.titleMainCategories`)}
        showTooltip={showTooltipInstructions(user)}
        tag="h3"
        tooltipContent={<MainCategoriesInstructions eventType={type} />}
        tooltipLabel={t(`event.form.notificationTitleMainCategories.${type}`)}
      />
      <FieldRow
        notification={
          showNotificationInstructions(user) ? (
            <Notification
              className={styles.notificationForTitle}
              label={t(`event.form.notificationTitleMainCategories.${type}`)}
              type="info"
            >
              <MainCategoriesInstructions eventType={type} />
            </Notification>
          ) : undefined
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
          />
        </FieldColumn>
      </FieldRow>

      <HeadingWithTooltip
        heading={t('event.form.titleKeywords')}
        showTooltip={showTooltipInstructions(user)}
        tag="h3"
        tooltipContent={<KeywordsInstructions eventType={type} />}
        tooltipLabel={t('event.form.titleKeywords')}
      />
      <FieldRow
        notification={
          showNotificationInstructions(user) ? (
            <Notification
              className={styles.notificationForTitle}
              label={t(`event.form.titleKeywords`)}
              type="info"
            >
              <KeywordsInstructions eventType={type} />
            </Notification>
          ) : undefined
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
      {!loadingKaskoOrganizations &&
        isUserAdminInKaskoOrganization &&
        eventTypeIsCourse && (
          <CrossInstitutionalStudiesSection
            isEditingAllowed={isEditingAllowed}
          />
        )}
    </Fieldset>
  );
};

export default ClassificationSection;
