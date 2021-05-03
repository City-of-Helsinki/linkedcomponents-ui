import classNames from 'classnames';
import { IconLinkExternal } from 'hds-react';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './serviceCard.module.scss';

type ServiceCardProps = {
  backgroundImageUrl: string;
  backgroundColor: 'metro' | 'suomenlinna';
  description?: string;
  href: string;
  title: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const ServiceCard: React.FC<ServiceCardProps> = ({
  'aria-label': ariaLabel,
  backgroundColor,
  backgroundImageUrl,
  description,
  href,
  title,
  ...rest
}) => {
  const { t } = useTranslation();

  return (
    <a
      {...rest}
      aria-label={ariaLabel || `${title} ${t('common.openInNewTab')}`}
      className={classNames(
        styles.serviceCard,
        styles[`color${capitalize(backgroundColor)}`]
      )}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className={styles.textWrapper}>
        <h2 className={styles.title}>{title}</h2>
        {!!description && (
          <div className={styles.description}>{description}</div>
        )}
        <IconLinkExternal aria-hidden={true} />
      </div>
      <div
        className={styles.bgImage}
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      />
    </a>
  );
};

export default ServiceCard;
