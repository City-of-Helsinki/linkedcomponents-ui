import { IconAngleRight } from 'hds-react';
import { FC } from 'react';
import { Link } from 'react-router-dom';

import styles from '../breadcrumb.module.scss';

type BreadcrumbItemCommonProps = {
  label: string;
};

export type BreadcrumbCurrentItemProps = BreadcrumbItemCommonProps & {
  active: true;
  to?: never;
};

export type BreadcrumbLinkItemProps = BreadcrumbItemCommonProps & {
  active?: false;
  to: string;
};

export type BreadcrumbItemProps =
  | BreadcrumbCurrentItemProps
  | BreadcrumbLinkItemProps;

const BreadcrumbItem: FC<BreadcrumbItemProps> = ({ active, label, to }) => {
  return (
    <>
      {active ? (
        <span aria-current="page" className={styles.current}>
          {label}
        </span>
      ) : (
        <>
          <Link to={to as string} className={styles.link}>
            {label}
          </Link>
          <IconAngleRight aria-hidden={true} className={styles.icon} />
        </>
      )}
    </>
  );
};

export default BreadcrumbItem;
