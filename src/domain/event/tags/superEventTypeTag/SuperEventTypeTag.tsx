import { ClassNames } from '@emotion/react';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../app/theme/Theme';
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
    <ClassNames>
      {({ css, cx }) => (
        <div
          className={cx(
            styles.superEventTypeTag,
            css(theme.superEventTypeTag),
            styles[`size${capitalize(size)}`],
            styles[`superEventType${capitalize(superEventType)}`],
            className
          )}
        >
          {t(`event.superEventType.${superEventType}`)}
        </div>
      )}
    </ClassNames>
  ) : null;
};

export default SuperEventTypeTag;
