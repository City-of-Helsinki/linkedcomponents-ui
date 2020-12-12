import { IconAngleRight } from 'hds-react';
import React from 'react';
import { useLocation } from 'react-router';

import useLocale from '../../../hooks/useLocale';
import styles from './breadcrumb.module.scss';

const Breadcrumb = () => {
  const location = useLocation();

  const pathnameParts = location.pathname.split('/').filter((part) => part);

  const getPathText = (item: string, index: number) => {
    if (index === 0) {
      return 'Kotisivu';
    } else if (index === 1) {
      const routeNames: Record<string, string> = {
        collections: 'Kokoelmat',
        domains: 'Sivustot',
        event: 'Tapahtumat',
        events: 'Tapahtumat',
        help: 'Ohjeet',
        images: 'Kuvat',
        keywords: 'Avainsanat',
        'keyword-sets': 'Avainsanaryhmät',
        organisations: 'Organisaatiot',
        places: 'Paikat',
        sites: 'Sivut',
      };

      return routeNames[item] || item;
    } else if (index === 2)
      if (pathnameParts[1] === 'event') {
        const eventRouteNames: Record<string, string> = {
          create: 'Uusi tapahtuma',
        };

        return eventRouteNames[item] || item;
      }
    return item;
  };

  const getPath = (index: number) => {
    return `/${pathnameParts.slice(0, index + 1).join('/')}`;
  };

  return (
    <nav className={styles.breadcrumb} aria-label="breadcrumb">
      <ol>
        {pathnameParts.map((item, index) => {
          if (index < pathnameParts.length - 1) {
            return (
              <li key={index}>
                <a href={getPath(index)}>{getPathText(item, index)}</a>
                <IconAngleRight />
              </li>
            );
          }
          return (
            <li key={index} aria-current="page">
              {getPathText(item, index)}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
