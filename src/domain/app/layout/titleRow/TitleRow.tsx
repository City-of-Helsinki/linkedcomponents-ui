import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';

import MenuDropdown from '../../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../../common/components/menuDropdown/types';
import styles from './titleRow.module.scss';

type TitleRowProps = {
  actionItems?: MenuItemOptionProps[];
  breadcrumb?: React.ReactElement;
  breadcrumbClassName?: string;
  button?: React.ReactElement;
  buttonWrapperClassName?: string;
  editingInfo?: React.ReactElement;
  title: string;
  titleClassName?: string;
};

const TitleRow = ({
  actionItems,
  breadcrumb,
  breadcrumbClassName,
  button,
  buttonWrapperClassName,
  editingInfo,
  title,
  titleClassName,
}: TitleRowProps): React.ReactElement => {
  const { t } = useTranslation();
  return (
    <div className={styles.titleRowWrapper}>
      {breadcrumb && (
        <div className={classNames(styles.breadcrumb, breadcrumbClassName)}>
          {breadcrumb}
        </div>
      )}
      <div className={styles.titleRow}>
        <div className={classNames(styles.title, titleClassName)}>
          <h1>{title}</h1>
          {editingInfo}
        </div>
        <div
          className={classNames(styles.buttonWrapper, buttonWrapperClassName)}
        >
          <div className={styles.actionsDropdown}>
            {!!actionItems?.length && (
              <MenuDropdown
                buttonLabel={t('common.buttonActions')}
                closeOnItemClick={true}
                items={actionItems}
                menuPosition="bottom"
              />
            )}
          </div>
        </div>
        {button && (
          <div
            className={classNames(styles.buttonWrapper, buttonWrapperClassName)}
          >
            {button}
          </div>
        )}
      </div>
    </div>
  );
};

export default TitleRow;
