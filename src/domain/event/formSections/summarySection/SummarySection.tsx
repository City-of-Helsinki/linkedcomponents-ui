import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxField from '../../../../common/components/formFields/CheckboxField';
import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { EVENT_FIELDS } from '../../constants';
import styles from './summarySection.module.scss';

const SummarySection: React.FC = () => {
  const locale = useLocale();
  const { t } = useTranslation();

  return (
    <div className={styles.panel}>
      <Field
        labelText={
          <span
            dangerouslySetInnerHTML={{
              __html: t('event.form.checkboxIsVerified', {
                openInNewTab: t('common.openInNewTab'),
                url: `/${locale}${ROUTES.HELP}`,
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
