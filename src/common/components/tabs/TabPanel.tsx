import React from 'react';

export type TabPanelProps = React.PropsWithChildren<{
  className?: string;
  index?: number;
  isActive?: boolean;
  name?: string;
  style?: React.CSSProperties;
}>;

const TabPanel = ({
  children,
  className,
  index,
  isActive,
  name,
  style,
}: TabPanelProps) => {
  return isActive ? (
    <div
      id={`tab-${name}-${index}-panel`}
      role="tabpanel"
      aria-labelledby={`tab-${name}-${index}-button`}
      className={className}
      style={style}
    >
      {children}
    </div>
  ) : null;
};

TabPanel.componentName = 'TabPanel';

export default TabPanel;
