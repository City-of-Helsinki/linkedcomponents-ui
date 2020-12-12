import classNames from 'classnames';
import { IconAngleDown, IconAngleUp } from 'hds-react';
import React from 'react';
import { useHistory, useLocation } from 'react-router';

import { ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { clearEventFormData } from '../../event/utils';
import styles from './sideNavigation.module.scss';

interface HeadingProps {
  openByDefault?: boolean;
  title: string;
}

const Heading: React.FC<HeadingProps> = ({
  children,
  openByDefault = false,
  title,
}) => {
  const [isOpen, setIsOpen] = React.useState(openByDefault);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li className={classNames(styles.heading, { [styles.open]: isOpen })}>
      <button className={styles.headingTitle} onClick={toggle}>
        {isOpen ? <IconAngleUp /> : <IconAngleDown />}
        {title}
      </button>
      {isOpen && <ul className={styles.menu}>{children}</ul>}
    </li>
  );
};

interface ItemProps {
  children: string;
  isActive?: boolean;
  onClick?: () => void;
  url?: string;
}

const Item: React.FC<ItemProps> = ({ children, isActive, onClick, url }) => {
  const history = useHistory();

  const goToPage = (url: string) => {
    history.push(url);
  };

  const handleClick = () => {
    url && goToPage(url);
    onClick && onClick();
  };

  return (
    <li
      className={classNames(styles.item, { [styles.active]: isActive })}
      onClick={handleClick}
    >
      {children}
    </li>
  );
};

const SideNavigation = () => {
  const location = useLocation();
  const locale = useLocale();

  const managementItems = [
    {
      onClick: () => {
        clearEventFormData();
      },
      url: `/${locale}${ROUTES.CREATE_EVENT}`,
      title: 'Tapahtumat',
    },
    { title: 'Kokoelmat', url: `/${locale}/collections` },
    { title: 'Organisaatiot', url: `/${locale}/organisations` },
    { title: 'Sivustot', url: `/${locale}/domains` },
    { title: 'Sivut', url: `/${locale}/sites` },
    { title: 'Kuvat', url: `/${locale}/images` },
    { title: 'Paikat', url: `/${locale}/places` },
    { title: 'Avainsanat', url: `/${locale}/keywords` },
    { title: 'Avainsanaryhmät', url: `/${locale}/keyword-sets` },
  ];

  const isTabActive = (pathname: string): boolean => {
    return location.pathname.startsWith(pathname);
  };

  return (
    <div className={styles.sideNavigation}>
      <ul className={styles.headings}>
        <Heading openByDefault={true} title="Hallinta">
          {managementItems.map((item, index) => {
            return (
              <Item
                key={index}
                isActive={!!item.url && isTabActive(item.url)}
                onClick={item.onClick}
                url={item.url}
              >
                {item.title}
              </Item>
            );
          })}
        </Heading>
        <Heading title="Raportointi"></Heading>
        <Heading title="Viestintä"></Heading>
        <Heading title="Ohjeet"></Heading>
      </ul>
    </div>
  );
};

export default SideNavigation;
