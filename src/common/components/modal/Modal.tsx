import classNames from 'classnames';
import { css } from 'emotion';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';

import { useTheme } from '../../../domain/app/theme/Theme';
import isTextEnv from '../../../utils/isTestEnv';
import CloseButton from '../closeButton/CloseButton';
import styles from './modal.module.scss';

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
if (!isTextEnv) {
  ReactModal.setAppElement('#root');
}

type Props = {
  onClose: (event?: React.MouseEvent | React.KeyboardEvent) => void;
  title: string;
} & Omit<ReactModal.Props, 'onRequestClose'>;

const Modal: React.FC<Props> = ({ children, onClose, title, ...rest }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <ReactModal
      {...rest}
      bodyOpenClassName={styles.bodyOpen}
      portalClassName={styles.modalPortal}
      className={classNames(styles.modal, css(theme.modal))}
      overlayClassName={styles.overlay}
      onRequestClose={onClose}
    >
      <div className={styles.headingWrapper}>
        <h2>{title}</h2>
        <CloseButton
          className={styles.closeButton}
          onClick={onClose}
          label={t('common.close')}
        />
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>{children}</div>
      </div>
    </ReactModal>
  );
};

export default Modal;
