import { ClassNames } from '@emotion/react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import { FCWithName, OptionType } from '../../../types';
import Tab from './tab/Tab';
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

const Tabs: React.FC<React.PropsWithChildren<Props>> = ({
  activeTab,
  className,
  children,
  name,
  onChange,
  options,
}) => {
  const { theme } = useTheme();
  const isFocused = React.useRef(false);
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
      return React.cloneElement(child as React.ReactElement, {
        index,
        name,
        isActive: activeIndex === index,
      });
    });

  return (
    <ClassNames>
      {({ css, cx }) => (
        <div
          className={className}
          onBlur={() => {
            isFocused.current = false;
          }}
          onFocus={() => {
            isFocused.current = true;
          }}
        >
          <div
            className={cx(styles.tabList, css(theme.tabs))}
            role="tablist"
            onKeyDown={onKeyDown}
          >
            {options.map((option, index) => {
              return (
                <Tab
                  key={option.value}
                  autoFocusChange={isFocused.current}
                  index={index}
                  isCompleted={option.isCompleted}
                  isFocused={index === focusedTab}
                  isActive={option.value === activeTab}
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
      )}
    </ClassNames>
  );
};

export default Tabs;
