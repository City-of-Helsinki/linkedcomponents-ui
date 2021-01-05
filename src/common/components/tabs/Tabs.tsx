import classNames from 'classnames';
import { css } from 'emotion';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import { FCWithName, OptionType } from '../../../types';
import Tab from './Tab';
import styles from './tabs.module.scss';

type TabOptionType = {
  isCompleted?: boolean;
} & OptionType;

interface Props {
  activeTab: string;
  className?: string;
  name: string;
  onChange: (selected: string) => void;
  options: TabOptionType[];
}

const Tabs: React.FC<Props> = ({
  activeTab,
  className,
  children,
  name,
  onChange,
  options,
}) => {
  const { theme } = useTheme();
  const activeIndex = React.useMemo(
    () => options.findIndex((option) => option.value === activeTab),
    [activeTab, options]
  );
  const [focusedTab, setFocusedTab] = React.useState(0);

  const handleChange = (newLanguage: string) => {
    onChange(newLanguage);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      setFocusedTab(Math.min(focusedTab + 1, options.length - 1));
    }
    if (event.key === 'ArrowLeft') {
      setFocusedTab(Math.max(focusedTab - 1, 0));
    }
  };

  const tabPanels = React.Children.toArray(children)
    .filter((child) => {
      return (
        React.isValidElement(child) &&
        (child.type as FCWithName).componentName === 'TabPanel'
      );
    })
    .map((child, index) => {
      /* istanbul ignore else  */
      if (React.isValidElement(child)) {
        const isActive = activeIndex === index;
        // Pass index prop to the TabPanel
        return React.cloneElement(child, { index, name, isActive });
      } else {
        return child;
      }
    });

  return (
    <div className={className}>
      <div
        className={classNames(styles.tabList, css(theme.tabs))}
        role="tablist"
        onKeyDown={onKeyDown}
      >
        {options.map((option, index) => {
          const isFocused = index === focusedTab;
          const isActive = option.value === activeTab;

          return (
            <Tab
              key={option.value}
              index={index}
              isCompleted={option.isCompleted}
              isFocused={isFocused}
              isActive={isActive}
              name={name}
              option={option}
              onClick={handleChange}
              setFocusedTab={setFocusedTab}
            />
          );
        })}
      </div>
      {tabPanels}
    </div>
  );
};

export default Tabs;
