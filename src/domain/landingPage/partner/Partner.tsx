import React from 'react';

import styles from './partner.module.scss';

type Props = {
  href: string;
  imageUrl: string;
  name: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const Partner: React.FC<Props> = ({ href, imageUrl, name, ...rest }) => {
  return (
    <a {...rest} href={href} className={styles.partner}>
      <img src={imageUrl} alt={name} />
    </a>
  );
};

export default Partner;
