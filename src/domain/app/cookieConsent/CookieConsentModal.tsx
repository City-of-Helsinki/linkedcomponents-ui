import { Button, Dialog, IconInfoCircle, Navigation } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Checkbox from '../../../common/components/checkbox/Checkbox';
import { ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import useSelectLanguage from '../../../hooks/useSelectLanguage';
import styles from './cookieConsentModal.module.scss';
import { Consent } from './types';

export interface CookieContentModalProps {
  isOpen: boolean;
  saveConsentToCookie: (options: Omit<Consent, 'acceptedAt'>) => void;
}
const CookieConsentModal: React.FC<CookieContentModalProps> = ({
  isOpen,
  saveConsentToCookie,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { changeLanguage, languageOptions } = useSelectLanguage();

  const [confirmed, setConfirmed] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setConfirmed(false);
    }
  }, [isOpen]);

  const onChangeConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmed(e.target.checked);
  };

  const id = 'cookie-consent-modal';
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <Dialog
      id={id}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={styles.modal}
      isOpen={isOpen}
      variant="primary"
    >
      <div className={styles.languageSelector}>
        <Navigation.LanguageSelector
          buttonAriaLabel={t('navigation.languageSelectorAriaLabel')}
          label={t(`navigation.languages.${locale}`)}
        >
          {languageOptions.map((option) => (
            <Navigation.Item
              key={option.value}
              href="#"
              lang={option.value}
              label={option.label}
              onClick={changeLanguage(option)}
            />
          ))}
        </Navigation.LanguageSelector>
      </div>
      <Dialog.Header
        id={titleId}
        iconLeft={<IconInfoCircle aria-hidden={true} />}
        title={t('common.cookieConsent.title')}
      />
      <Dialog.Content>
        <p id={descriptionId}>
          <strong>{t('common.cookieConsent.text1')}</strong>
        </p>
        <p>
          <span
            dangerouslySetInnerHTML={{
              __html: t('common.cookieConsent.text2', {
                openInNewTab: t('common.openInNewTab'),
                urlDataProtection: t('common.cookieConsent.linkDataProtection'),
                urlPrivacyPolicy: t('common.cookieConsent.linkPrivacyPolicy'),
              }),
            }}
          />
          <br />
          {t('common.cookieConsent.text3')}
        </p>

        <Checkbox
          className={styles.checkbox}
          id="confirm-checkbox"
          checked={confirmed}
          aria-label={t('common.cookieConsent.checkboxAcceptAriaLabel')}
          label={
            <span
              dangerouslySetInnerHTML={{
                __html: t('common.cookieConsent.checkboxAccept', {
                  openInNewTab: t('common.openInNewTab'),
                  url: `/${locale}${ROUTES.SUPPORT_TERMS_OF_USE}`,
                }),
              }}
            />
          }
          onChange={onChangeConfirm}
        />
      </Dialog.Content>
      <Dialog.ActionButtons>
        <div className={styles.buttonWrapper}>
          <Button
            disabled={!confirmed}
            onClick={() => {
              saveConsentToCookie({
                required: true,
                tracking: true,
              });
            }}
            type="button"
            variant="primary"
          >
            {t('common.cookieConsent.buttonAcceptAll')}
          </Button>
          <Button
            disabled={!confirmed}
            onClick={() => {
              saveConsentToCookie({
                required: true,
                tracking: false,
              });
            }}
            type="button"
            variant="primary"
          >
            {t('common.cookieConsent.buttonAcceptOnlyNecessary')}
          </Button>
          <Button
            disabled={!confirmed}
            onClick={() => {
              saveConsentToCookie({
                required: false,
                tracking: false,
              });
            }}
            type="button"
            variant="secondary"
          >
            {t('common.cookieConsent.buttonDecline')}
          </Button>
        </div>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

export default CookieConsentModal;
