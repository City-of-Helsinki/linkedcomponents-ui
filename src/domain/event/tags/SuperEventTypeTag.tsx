import { css } from '@emotion/css';
import classNames from 'classnames';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../app/theme/Theme';
import styles from './superEventTypeTag.module.scss';

interface Props {
  className?: string;
  size?: 's' | 'm';
  superEventType: string | null;
}

const SuperEventTypeTag: React.FC<Props> = ({
  className,
  size = 's',
  superEventType,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return superEventType ? (
    <div
      className={classNames(
        styles.superEventTypeTag,
        css(theme.superEventTypeTag),
        styles[`size${capitalize(size)}`],
        styles[`superEventType${capitalize(superEventType)}`],
        className
      )}
    >
      {t(`event.superEventType.${superEventType}`)}
    </div>
  ) : null;
};

export default SuperEventTypeTag;
