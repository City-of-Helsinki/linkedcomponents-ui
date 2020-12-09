import classNames from 'classnames';
import { css } from 'emotion';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';

import Button from '../../../common/components/button/Button';
import Container from '../../app/layout/Container';
import FormContainer from '../../app/layout/FormContainer';
import { useTheme } from '../../app/theme/Theme';
import { URL_PARAMS } from '../constants';
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
  const history = useHistory();
  const location = useLocation();
  const { theme } = useTheme();
  const searchParams = new URLSearchParams(location.search);

  const defaultTab: number = React.useMemo(() => {
    const tab = Number(searchParams.get(URL_PARAMS.TAB));

    if (Number.isInteger(tab)) {
      return tab < items.length && !items[tab].disabled ? tab : 0;
    }
    return 0;
  }, [items, searchParams]);

  const [activeTab, setActiveTab] = React.useState(defaultTab || 0);

  const handleActiveTabChange = (index: number) => {
    const search = location.search;
    const searchParams = new URLSearchParams(search);

    setActiveTab(index);

    searchParams.set(URL_PARAMS.TAB, index.toString());

    history.push({ search: searchParams.toString() });
  };

  const handleItemClick = (item: EventNavigationItem, index: number) => () => {
    if (item.disabled) return;

    handleActiveTabChange(index);
  };

  const isPreviousDisabled = !activeTab;
  const isNextDisabled: boolean =
    activeTab === items.length - 1 || !!items[activeTab + 1]?.disabled;

  const handlePreviousClick = () => {
    handleActiveTabChange(activeTab - 1);
  };

  const handleNextClick = () => {
    handleActiveTabChange(activeTab + 1);
  };

  return (
    <div
      className={classNames(styles.eventNavigation, css(theme.eventNavigation))}
    >
      <div className={styles.eventNavigationPanel}>
        <Container>
          <div className={styles.eventNavigationPanelWrapper}>
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
                fullWidth={true}
                onClick={handlePreviousClick}
                variant="secondary"
              >
                {t('event.navigation.buttonPrevious')}
              </Button>
              <Button
                disabled={isNextDisabled}
                fullWidth={true}
                onClick={handleNextClick}
              >
                {t('event.navigation.buttonNext')}
              </Button>
            </div>
          </div>
        </Container>
      </div>
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
            <FormContainer>
              <div className={styles.titleRow}>
                <h2>{item.label}</h2>
                <Button disabled={true} variant="secondary" type="submit">
                  {t('createEventPage.buttonSaveDraft')}
                </Button>
              </div>
              {item.component}
            </FormContainer>
          </div>
        );
      })}
    </div>
  );
};

export default EventNavigation;
