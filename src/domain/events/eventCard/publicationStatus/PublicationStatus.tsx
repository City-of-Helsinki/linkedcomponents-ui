import { ClassNames } from '@emotion/react';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { PublicationStatus as PublicationStatusEnum } from '../../../../generated/graphql';
import { useTheme } from '../../../app/theme/Theme';
import styles from './publicationStatus.module.scss';

interface Props {
  publicationStatus: PublicationStatusEnum;
}

const PublicationStatus: React.FC<Props> = ({ publicationStatus }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <ClassNames>
      {({ css, cx }) => (
        <span
          className={cx(
            styles.publicationStatus,
            css(theme.publicationStatus),
            styles[`status${capitalize(publicationStatus)}`]
          )}
        >
          {t(`event.publicationStatus.${publicationStatus}`)}
        </span>
      )}
    </ClassNames>
  );
};

export default PublicationStatus;
