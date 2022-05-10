import { IconAngleRight } from 'hds-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { FCWithName } from '../../../types';
import styles from './breadcrumb.module.scss';

type BreadcrumbItemCommonProps = {
  className?: string;
};

type BreadcrumbItemProps = BreadcrumbItemCommonProps &
  ({ active?: false; to: string } | { active: true; to?: never });

const BreadcrumbItem: FCWithName<
  React.PropsWithChildren<BreadcrumbItemProps>
> = ({ active, children, className, to }) => {
  return (
    <>
      {active ? (
        <li className={className}>
          <p className={styles.breadcrumbActiveItem}>{children}</p>
        </li>
      ) : (
        <>
          <li className={className}>
            <Link to={to as string} className={styles.breadcrumbLink}>
              {children}
            </Link>
          </li>
          <li className={styles.breadcrumbSeparator} aria-hidden={true}>
            <IconAngleRight aria-hidden={true} />
          </li>
        </>
      )}
    </>
  );
};

BreadcrumbItem.componentName = 'BreadcrumbItem';

export default BreadcrumbItem;
