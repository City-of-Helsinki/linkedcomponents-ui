import { Field, useField, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../common/components/button/Button';
import ExternalLink from '../../../../common/components/externalLink/ExternalLink';
import CheckboxField from '../../../../common/components/formFields/CheckboxField';
import InputRow from '../../../../common/components/inputRow/InputRow';
import Notification from '../../../../common/components/notification/Notification';
import { INPUT_MAX_WIDTHS, ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { EVENT_FIELDS } from '../../constants';
import InputWrapper from '../InputWrapper';
import styles from './summarySection.module.scss';

interface SummarySectionProps {
  onSaveDraft: () => void;
}

const SummarySection: React.FC<SummarySectionProps> = ({ onSaveDraft }) => {
  const { isValid } = useFormikContext();
  const locale = useLocale();
  const { t } = useTranslation();
  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const [{ value: isVerified }] = useField({ name: EVENT_FIELDS.IS_VERIFIED });

  return (
    <div>
      <h3>{t(`event.form.titleSummary.${type}`)}</h3>

      <InputRow
        infoColumns={4}
        info={
          <Notification
            label={t(`event.form.notificationTitlePublishing.${type}`)}
            type="info"
          >
            <p>{t(`event.form.infoTextPublishing`)}</p>
            <ExternalLink
              href={`/${locale}${ROUTES.HELP}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(`event.form.linkReadMoreAboutPublishing.${type}`)}
            </ExternalLink>
          </Notification>
        }
      >
        <InputWrapper maxWidth={INPUT_MAX_WIDTHS.LARGE}>
          <div className={styles.buttonWrapper}>
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
            <Button fullWidth={true} disabled={!isValid} type="submit">
              {t(`event.form.buttonPublish.${type}`)}
            </Button>
            <Button
              fullWidth={true}
              disabled={!isVerified}
              onClick={onSaveDraft}
              type="button"
            >
              {t('event.form.buttonSaveDraft')}
            </Button>
          </div>
        </InputWrapper>
      </InputRow>
    </div>
  );
};

export default SummarySection;
