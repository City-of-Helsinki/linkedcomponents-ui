import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxField from '../../../../common/components/formFields/CheckboxField';
import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { EVENT_FIELDS } from '../../constants';
import styles from './summarySection.module.scss';

interface Props {
  isEditingAllowed: boolean;
}

const SummarySection: React.FC<Props> = ({ isEditingAllowed }) => {
  const locale = useLocale();
  const { t } = useTranslation();

  return (
    <div className={styles.panel}>
      <Field
        disabled={!isEditingAllowed}
        label={
          <span
            dangerouslySetInnerHTML={{
              __html: t('event.form.checkboxIsVerified', {
                openInNewTab: t('common.openInNewTab'),
                url: `/${locale}${ROUTES.SUPPORT_TERMS_OF_USE}`,
              }),
            }}
          />
        }
        name={[EVENT_FIELDS.IS_VERIFIED]}
        component={CheckboxField}
      />
    </div>
  );
};

export default SummarySection;
