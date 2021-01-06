import classNames from 'classnames';
import { css } from 'emotion';
import { IconCheck, IconPen } from 'hds-react/icons';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { PublicationStatus } from '../../../generated/graphql';
import { useTheme } from '../../app/theme/Theme';
import styles from './publicationStatusTag.module.scss';

interface Props {
  publicationStatus: PublicationStatus;
}

const PublicationStatusTag: React.FC<Props> = ({ publicationStatus }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const getIcon = () => {
    switch (publicationStatus) {
      case PublicationStatus.Draft:
        return <IconPen aria-hidden={true} />;
      case PublicationStatus.Public:
        return <IconCheck aria-hidden={true} />;
    }
  };
  return (
    <div
      className={classNames(
        styles.publicationStatusTag,
        css(theme.publicationStatusTag),
        styles[`status${capitalize(publicationStatus)}`]
      )}
    >
      {getIcon()}
      {t(`event.publicationStatus.${publicationStatus}`)}
    </div>
  );
};

export default PublicationStatusTag;
