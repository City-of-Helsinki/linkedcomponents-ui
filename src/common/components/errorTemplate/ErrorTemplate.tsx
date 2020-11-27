import classNames from 'classnames';
import { css } from 'emotion';
import {
  IconAlertCircle,
  IconAngleRight,
  IconSpeechbubbleText,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Container from '../../../domain/app/layout/Container';
import { useTheme } from '../../../domain/app/theme/Theme';
import Button from '../button/Button';
import styles from './errorTemplate.module.scss';

interface Props {
  buttons: React.ReactNode;
  text: string;
}

const ErrorPage: React.FC<Props> = ({ buttons, text }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const goToFeedback = () => {
    window.open(t('common.feedback.url'), '_self');
  };

  return (
    <div>
      <Container
        className={classNames(styles.errorTemplate, css(theme.errorTemplate))}
      >
        <div className={styles.content}>
          <IconAlertCircle className={styles.icon} />
          <p>{text}</p>
          <div className={styles.buttonsWrapper}>{buttons}</div>
          <Button
            iconLeft={<IconSpeechbubbleText />}
            iconRight={<IconAngleRight />}
            onClick={goToFeedback}
            variant="supplementary"
          >
            {t('common.feedback.text')}
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default ErrorPage;
