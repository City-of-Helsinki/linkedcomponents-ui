import { IconMenuDots } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import MenuDropdown from '../menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../menuDropdown/types';
import styles from './actionsDropdown.module.scss';

interface Props {
  className?: string;
  items: MenuItemOptionProps[];
}

const ActionsDropdown: React.FC<Props> = ({ className, items }) => {
  const { t } = useTranslation();
  return (
    <MenuDropdown
      button={
        <button className={styles.toggleButton}>
          <IconMenuDots aria-hidden={true} />
        </button>
      }
      buttonLabel={t('common.buttonActions')}
      className={className}
      closeOnItemClick={true}
      fixedPosition={true}
      items={items}
    />
  );
};

export default ActionsDropdown;
