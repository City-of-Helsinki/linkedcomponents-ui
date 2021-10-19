import classNames from 'classnames';
import { IconArrowLeft, IconMenuDots } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import MenuDropdown from '../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import Container from '../../../domain/app/layout/Container';
import useIsMobile from '../../../hooks/useIsMobile';
import styles from './buttonPanel.module.scss';

export interface ButtonPanelProps {
  actionItems?: MenuItemOptionProps[];
  contentWrapperClassName?: string;
  onBack?: () => void;
  submitButtons?: React.ReactElement[];
}

const ButtonPanel: React.FC<ButtonPanelProps> = ({
  actionItems,
  contentWrapperClassName,
  onBack,
  submitButtons,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div className={styles.buttonPanel}>
      <Container withOffset={true}>
        <div className={contentWrapperClassName}>
          <div className={styles.buttonsRow}>
            <div
              className={classNames(styles.submitButtons, {
                [styles.hideOnMobile]: !submitButtons?.length,
              })}
            >
              {submitButtons}
            </div>
            <div
              className={classNames(styles.otherButtons, {
                [styles.hideOnMobile]: !onBack && !actionItems?.length,
              })}
            >
              {onBack && (
                <Button
                  className={classNames(styles.backButton, styles.smallButton)}
                  iconLeft={<IconArrowLeft aria-hidden />}
                  fullWidth={true}
                  onClick={onBack}
                  type="button"
                  variant="secondary"
                >
                  {t('common.buttonBack')}
                </Button>
              )}
              <div className={styles.actionsDropdown}>
                {!!actionItems?.length && (
                  <MenuDropdown
                    button={
                      isMobile ? (
                        <button className={styles.toggleButton}>
                          <IconMenuDots aria-hidden={true} />
                        </button>
                      ) : undefined
                    }
                    buttonLabel={t('common.buttonActions')}
                    closeOnItemClick={true}
                    items={actionItems}
                    menuPosition="top"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ButtonPanel;
