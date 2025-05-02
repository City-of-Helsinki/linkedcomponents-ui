import { Field, useField } from 'formik';
import { sortBy } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxField from '../../../../../common/components/formFields/checkboxField/CheckboxField';
import CheckboxGroupField from '../../../../../common/components/formFields/checkboxGroupField/CheckboxGroupField';
import useLocale from '../../../../../hooks/useLocale';
import getValue from '../../../../../utils/getValue';
import FieldColumn from '../../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../../app/layout/fieldRow/FieldRow';
import { getKeywordOption } from '../../../../keywordSet/utils';
import { EVENT_FIELDS } from '../../../constants';
import useEventFieldOptionsData from '../../../hooks/useEventFieldOptionsData';

interface Props {
  isEditingAllowed: boolean;
}

const CrossInstitutionalStudiesSection: React.FC<Props> = ({
  isEditingAllowed,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();

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
        <h3>{t('event.form.titleCrossInstitutionalStudies')}</h3>
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
            <h4>{t('event.form.labelEducationModels')}</h4>
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
            <h4>{t('event.form.labelEducationLevels')}</h4>
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
