import { css } from '@emotion/css';
import classNames from 'classnames';
import { IconAlertCircle, IconInfoCircle, Navigation } from 'hds-react';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';

import { useTheme } from '../../../domain/app/theme/Theme';
import useLocale from '../../../hooks/useLocale';
import useSelectLanguage from '../../../hooks/useSelectLanguage';
import isTestEnv from '../../../utils/isTestEnv';
import CloseButton from '../closeButton/CloseButton';
import styles from './modal.module.scss';

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
/* istanbul ignore next */
if (!isTestEnv) {
  ReactModal.setAppElement('#root');
}

type Props = {
  onClose?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  showLanguageSelector?: boolean;
  size?: 'm' | 'l';
  title: string;
  type?: 'alert' | 'form' | 'info';
} & Omit<ReactModal.Props, 'onRequestClose'>;

const Modal: React.FC<Props> = ({
  children,
  className,
  onClose,
  showLanguageSelector,
  size = 'l',
  title,
  type = 'form',
  ...rest
}) => {
  const { changeLanguage, languageOptions } = useSelectLanguage();
  const locale = useLocale();
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <ReactModal
      {...rest}
      ariaHideApp={!isTestEnv}
      bodyOpenClassName={styles.bodyOpen}
      portalClassName={styles.modalPortal}
      className={classNames(
        styles.modal,
        className,
        styles[`size${capitalize(size)}`],
        styles[`type${capitalize(type)}`],
        css(theme.modal)
      )}
      overlayClassName={styles.overlay}
      onRequestClose={onClose}
    >
      <div className={styles.headingWrapper}>
        {showLanguageSelector && (
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
        )}
        <div className={styles.heading}>
          {size === 'm' && (
            <>
              {type === 'alert' && <IconAlertCircle />}
              {type === 'info' && <IconInfoCircle />}
            </>
          )}
          <h2>{title}</h2>
          {size === 'l' && onClose && (
            <CloseButton
              className={styles.closeButton}
              onClick={onClose}
              label={t('common.close')}
            />
          )}
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>{children}</div>
      </div>
    </ReactModal>
  );
};

export default Modal;
