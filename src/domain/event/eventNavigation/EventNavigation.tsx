import classNames from 'classnames';
import { css } from 'emotion';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import Container from '../../app/layout/Container';
import { useTheme } from '../../app/theme/Theme';
import styles from './eventNavigation.module.scss';

interface EventNavigationItem {
  component: React.ReactElement;
  disabled?: boolean;
  isCompleted: boolean;
  label: string;
}

interface Props {
  items: EventNavigationItem[];
}

const EventNavigation: React.FC<Props> = ({ items }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = React.useState(0);

  const handleItemClick = (item: EventNavigationItem, index: number) => () => {
    if (item.disabled) return;

    setActiveTab(index);
  };

  const isPreviousDisabled = !activeTab;
  const isNextDisabled: boolean =
    activeTab === items.length - 1 || !!items[activeTab + 1]?.disabled;

  const handlePreviousClick = () => {
    setActiveTab(activeTab - 1);
  };

  const handleNextClick = () => {
    setActiveTab(activeTab + 1);
  };

  return (
    <div
      className={classNames(styles.eventNavigation, css(theme.eventNavigation))}
    >
      <div className={styles.eventNavigationPanel}>
        <div className={styles.circlesWrapper} role="navigation">
          {items.map((item, index) => {
            return (
              <button
                key={index}
                className={classNames(styles.item, {
                  [styles.completed]: item.isCompleted,
                  [styles.disabled]: item.disabled,
                })}
                aria-current={index === activeTab ? 'step' : false}
                aria-disabled={item.disabled}
                aria-label={item.label}
                role="link"
                tabIndex={item.disabled ? undefined : 0}
                type="button"
                onClick={handleItemClick(item, index)}
              >
                <div className={styles.circleWrapper}>
                  <div className={styles.leftLine}>
                    <div className={styles.connectionLine} />
                  </div>
                  <div className={styles.circle}>
                    {item.isCompleted ? '✓' : index + 1}
                  </div>
                  <div className={styles.rightLine}>
                    <div className={styles.connectionLine} />
                  </div>
                </div>
                <div className={styles.label}>{item.label}</div>
              </button>
            );
          })}
        </div>
        <div className={styles.buttonsWrapper}>
          <Button
            disabled={isPreviousDisabled}
            onClick={handlePreviousClick}
            variant="secondary"
          >
            {t('event.navigation.buttonPrevious')}
          </Button>
          <Button disabled={isNextDisabled} onClick={handleNextClick}>
            {t('event.navigation.buttonNext')}
          </Button>
        </div>
      </div>
      <Container>
        {items.map((item, index) => {
          const hidden = index !== activeTab;
          return (
            <div
              aria-hidden={hidden}
              key={index}
              className={classNames(styles.content, {
                [styles.hidden]: hidden,
              })}
            >
              <div className={styles.titleRow}>
                <h2>{item.label}</h2>
                <Button disabled={true} variant="secondary" type="submit">
                  {t('createEventPage.buttonSaveDraft')}
                </Button>
              </div>
              {item.component}
            </div>
          );
        })}
      </Container>
    </div>
  );
};

export default EventNavigation;
