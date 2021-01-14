import classNames from 'classnames';
import { css } from 'emotion';
import { IconCheck, IconPen } from 'hds-react';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { PublicationStatus } from '../../../generated/graphql';
import { useTheme } from '../../app/theme/Theme';
import styles from './publicationStatusTag.module.scss';

const iconMap = {
  [PublicationStatus.Draft]: <IconPen aria-hidden={true} />,
  [PublicationStatus.Public]: <IconCheck aria-hidden={true} />,
};

interface Props {
  publicationStatus: PublicationStatus;
}

const PublicationStatusTag: React.FC<Props> = ({ publicationStatus }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <div
      className={classNames(
        styles.publicationStatusTag,
        css(theme.publicationStatusTag),
        styles[`status${capitalize(publicationStatus)}`]
      )}
    >
      {iconMap[publicationStatus]}
      {t(`event.publicationStatus.${publicationStatus}`)}
    </div>
  );
};

export default PublicationStatusTag;
