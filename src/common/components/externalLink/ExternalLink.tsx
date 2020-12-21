import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = { children: string; className?: string } & React.HTMLProps<
  HTMLAnchorElement
>;

const ExternalLink: React.FC<Props> = ({ children, className, ...rest }) => {
  const { t } = useTranslation();

  return (
    <a
      aria-label={`${children} ${t('common.openInNewTab')}`}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
};

export default ExternalLink;
