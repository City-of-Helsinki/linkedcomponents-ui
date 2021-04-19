import classNames from 'classnames';
import { IconArrowRight } from 'hds-react';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './serviceCard.module.scss';

type ServiceCardProps = {
  backgroundImageUrl: string;
  description?: string;
  href: string;
  size?: 'medium' | 'large';
  title: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const ServiceCard: React.FC<ServiceCardProps> = ({
  'aria-label': ariaLabel,
  backgroundImageUrl,
  description,
  href,
  size = 'medium',
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
        styles[`size${capitalize(size)}`]
      )}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div
        className={styles.bgImage}
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      />
      <div className={styles.textWrapper}>
        <button aria-hidden={true} className={styles.iconButton}>
          <IconArrowRight aria-hidden={true} />
        </button>
        <h2 className={styles.title}>{title}</h2>
        {!!description && (
          <div className={styles.description}>{description}</div>
        )}
      </div>
    </a>
  );
};

export default ServiceCard;
