import { ClassNames } from '@emotion/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './breadcrumb.module.scss';
import BreadcrumbItem, {
  BreadcrumbCurrentItemProps,
  BreadcrumbLinkItemProps,
} from './breadcrumbItem/BreadcrumbItem';

type BreadcrumbProps = {
  ariaLabel?: string;
  className?: string;
  items: [
    BreadcrumbLinkItemProps,
    ...BreadcrumbLinkItemProps[],
    BreadcrumbCurrentItemProps
  ];
};

const Breadcrumb = ({
  ariaLabel,
  className,
  items,
}: BreadcrumbProps): React.ReactElement => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <ClassNames>
      {({ css, cx }) => (
        <nav
          className={cx(styles.breadcrumb, className, css(theme.breadcrumb))}
          aria-label={ariaLabel || (t('common.breadcrumb') as string)}
          role="navigation"
        >
          {items.map((props, index) => (
            <BreadcrumbItem key={index} {...props} />
          ))}
        </nav>
      )}
    </ClassNames>
  );
};

export default Breadcrumb;
