import { Field, useField } from 'formik';
import { sortBy } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxField from '../../../../../common/components/formFields/checkboxField/CheckboxField';
import CheckboxGroupField from '../../../../../common/components/formFields/checkboxGroupField/CheckboxGroupField';
import HeadingWithTooltip from '../../../../../common/components/headingWithTooltip/HeadingWithTooltip';
import useLocale from '../../../../../hooks/useLocale';
import getValue from '../../../../../utils/getValue';
import FieldColumn from '../../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../../app/layout/fieldRow/FieldRow';
import { getKeywordOption } from '../../../../keywordSet/utils';
import useUser from '../../../../user/hooks/useUser';
import { EVENT_FIELDS } from '../../../constants';
import useEventFieldOptionsData from '../../../hooks/useEventFieldOptionsData';
import { showTooltipInstructions } from '../../../utils';

interface Props {
  isEditingAllowed: boolean;
}

const CrossInstitutionalStudiesSection: React.FC<Props> = ({
  isEditingAllowed,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { user } = useUser();

  const [{ value: isCrossInstitutionalStudies }] = useField({
    name: EVENT_FIELDS.CROSS_INSTITUTIONAL_STUDIES,
  });

  const { educationLevelsData, educationModelsData } =
    useEventFieldOptionsData();

  const educationModelsOptions = React.useMemo(
    () =>
      sortBy(
        getValue(
          educationModelsData?.keywordSet?.keywords?.map((keyword) =>
            getKeywordOption({ keyword, locale })
          ),
          []
        ),
        'label'
      ),
    [locale, educationModelsData]
  );

  const educationLevelsOptions = React.useMemo(
    () =>
      sortBy(
        getValue(
          educationLevelsData?.keywordSet?.keywords?.map((keyword) =>
            getKeywordOption({ keyword, locale })
          ),
          []
        ),
        'label'
      ),
    [locale, educationLevelsData]
  );

  return (
    <FieldRow>
      <FieldColumn>
        <HeadingWithTooltip
          heading={t('event.form.titleCrossInstitutionalStudies')}
          tag="h3"
          showTooltip={showTooltipInstructions(user)}
          tooltipContent={
            <p>{t('event.form.infoTextCrossInstitutionalStudies')}</p>
          }
          tooltipLabel={t('event.form.titleCrossInstitutionalStudies')}
        />

        <Field
          component={CheckboxField}
          name={EVENT_FIELDS.CROSS_INSTITUTIONAL_STUDIES}
          disabled={!isEditingAllowed}
          label={t('event.form.labelCrossInstitutionalStudies')}
        />
      </FieldColumn>
      {!!isCrossInstitutionalStudies && (
        <>
          <FieldColumn>
            <HeadingWithTooltip
              heading={t('event.form.labelEducationModels')}
              tag="h4"
              showTooltip={showTooltipInstructions(user)}
              tooltipContent={<p>{t('event.form.infoTextEducationModels')}</p>}
              tooltipLabel={t('event.form.labelEducationModels')}
            />
            <Field
              component={CheckboxGroupField}
              name={EVENT_FIELDS.EDUCATION_MODELS_KEYWORDS}
              disabled={!isEditingAllowed}
              label={t('event.form.labelEducationModels')}
              options={educationModelsOptions}
              required
            />
          </FieldColumn>
          <FieldColumn>
            <HeadingWithTooltip
              heading={t('event.form.labelEducationLevels')}
              tag="h4"
              showTooltip={showTooltipInstructions(user)}
              tooltipContent={<p>{t('event.form.infoTextEducationLevels')}</p>}
              tooltipLabel={t('event.form.labelEducationLevels')}
            />
            <Field
              component={CheckboxGroupField}
              name={EVENT_FIELDS.EDUCATION_LEVELS_KEYWORDS}
              disabled={!isEditingAllowed}
              label={t('event.form.labelEducationLevels')}
              options={educationLevelsOptions}
              required
            />
          </FieldColumn>
        </>
      )}
    </FieldRow>
  );
};

export default CrossInstitutionalStudiesSection;
