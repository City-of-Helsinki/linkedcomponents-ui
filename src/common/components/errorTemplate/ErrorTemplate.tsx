import { ClassNames } from '@emotion/react';
import { IconAlertCircle } from 'hds-react';
import React from 'react';

import Container from '../../../domain/app/layout/container/Container';
import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './errorTemplate.module.scss';

interface Props {
  buttons?: React.ReactElement;
  text: string;
}

const ErrorTemplate: React.FC<React.PropsWithChildren<Props>> = ({
  buttons,
  children,
  text,
}) => {
  const { theme } = useTheme();
  return (
    <ClassNames>
      {({ css }) => (
        <Container
          className={css(theme.errorTemplate)}
          contentWrapperClassName={styles.errorTemplate}
        >
          <div className={styles.content}>
            <IconAlertCircle className={styles.icon} />
            {text && <p>{text}</p>}
            {buttons && <div className={styles.buttonsWrapper}>{buttons}</div>}
            {children}
          </div>
        </Container>
      )}
    </ClassNames>
  );
};

export default ErrorTemplate;
