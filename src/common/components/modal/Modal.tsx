import { ClassNames } from '@emotion/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';

import { useTheme } from '../../../domain/app/theme/Theme';
import isTestEnv from '../../../utils/isTestEnv';
import CloseButton from '../closeButton/CloseButton';
import styles from './modal.module.scss';

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
/* istanbul ignore next */
if (!isTestEnv) {
  ReactModal.setAppElement('#root');
}

type Props = {
  className?: string;
  onClose?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  showLanguageSelector?: boolean;
  title: string;
} & Omit<ReactModal.Props, 'onRequestClose'>;

const Modal: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
  onClose,
  title,
  ...rest
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <ClassNames>
      {({ css, cx }) => (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <ReactModal
          {...rest}
          ariaHideApp={!isTestEnv}
          bodyOpenClassName={styles.bodyOpen}
          portalClassName={styles.modalPortal}
          className={cx(styles.modal, className, css(theme.modal))}
          overlayClassName={styles.overlay}
          // There is a bug in react-modal and body class is not removed automatically
          // So do it manually here
          onAfterClose={() => document.body.classList.remove(styles.bodyOpen)}
          onRequestClose={onClose}
        >
          <div className={styles.headingWrapper}>
            <div className={styles.heading}>
              <h2>{title}</h2>
              {onClose && (
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
      )}
    </ClassNames>
  );
};

export default Modal;
