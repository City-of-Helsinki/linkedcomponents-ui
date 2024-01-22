import classNames from 'classnames';
import { IconArrowLeft, IconMenuDots } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import MenuDropdown from '../../../common/components/menuDropdown/MenuDropdown';
import Container from '../../../domain/app/layout/container/Container';
import useIsMobile from '../../../hooks/useIsMobile';
import { MenuItemOptionProps } from '../menuDropdown/types';
import styles from './buttonPanel.module.scss';

export interface ButtonPanelProps {
  actionItems?: MenuItemOptionProps[];
  contentWrapperClassName?: string;
  onBack?: () => void;
  submitButtons?: React.ReactElement[];
  withOffset?: boolean;
}

const ButtonPanel: React.FC<ButtonPanelProps> = ({
  actionItems,
  contentWrapperClassName,
  onBack,
  submitButtons,
  withOffset = true,
}) => {
  const buttonPanel = React.useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  /* istanbul ignore next */
  const onDocumentFocusin = (event: FocusEvent) => {
    const target = event.target;

    if (
      target instanceof HTMLElement &&
      !buttonPanel.current?.contains(target)
    ) {
      const buttonPanelRect = buttonPanel.current?.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      if (
        buttonPanelRect &&
        buttonPanelRect.top < targetRect.bottom &&
        window.innerHeight === buttonPanelRect.bottom
      ) {
        window.scrollBy(
          0,
          targetRect.bottom - buttonPanelRect.top + buttonPanelRect.height
        );
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener('focusin', onDocumentFocusin);

    return () => {
      document.removeEventListener('focusin', onDocumentFocusin);
    };
  });

  return (
    <div ref={buttonPanel} className={styles.buttonPanel}>
      <Container
        className={classNames({ [styles.noOffset]: !withOffset })}
        withOffset={withOffset}
      >
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
