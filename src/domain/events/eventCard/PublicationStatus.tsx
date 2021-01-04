import classNames from 'classnames';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { PublicationStatus as PublicationStatusEnum } from '../../../generated/graphql';
import styles from './publicationStatus.module.scss';

interface Props {
  publicationStatus: PublicationStatusEnum;
}

const PublicationStatus: React.FC<Props> = ({ publicationStatus }) => {
  const { t } = useTranslation();
  return (
    <span
      className={classNames(
        styles.publicationStatus,
        styles[`status${capitalize(publicationStatus)}`]
      )}
    >
      {t(`event.publicationStatus.${publicationStatus}`)}
    </span>
  );
};

export default PublicationStatus;
