import { css } from '@emotion/css';
import { IconAlertCircle } from 'hds-react';
import React from 'react';

import Container from '../../../domain/app/layout/Container';
import { useTheme } from '../../../domain/app/theme/Theme';
import FeedbackButton from '../feedbackButton/FeedbackButton';
import styles from './errorTemplate.module.scss';

interface Props {
  buttons: React.ReactNode;
  text: string;
}

const ErrorPage: React.FC<Props> = ({ buttons, text }) => {
  const { theme } = useTheme();

  return (
    <Container
      className={css(theme.errorTemplate)}
      contentWrapperClassName={styles.errorTemplate}
    >
      <div className={styles.content}>
        <IconAlertCircle className={styles.icon} />
        <p>{text}</p>
        <div className={styles.buttonsWrapper}>{buttons}</div>
        <FeedbackButton />
      </div>
    </Container>
  );
};

export default ErrorPage;
