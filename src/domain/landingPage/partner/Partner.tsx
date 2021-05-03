import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './partner.module.scss';

type Props = {
  href: string;
  imageUrl: string;
  name: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const Partner: React.FC<Props> = ({
  'aria-label': ariaLabel,
  href,
  imageUrl,
  name,
  ...rest
}) => {
  const { t } = useTranslation();
  return (
    <a
      {...rest}
      href={href}
      className={styles.partner}
      aria-label={ariaLabel || `${name} ${t('common.openInNewTab')}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <img src={imageUrl} alt={name} />
    </a>
  );
};

export default Partner;
