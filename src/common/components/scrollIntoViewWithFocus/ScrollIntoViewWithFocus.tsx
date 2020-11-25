import React from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

interface Props {
  as?: 'div' | 'li';
  children: React.ReactNode;
  isFocused: boolean;
  scrollIntoViewOptions?: ScrollIntoViewOptions;
}

const ScrollIntoViewWithFocus: React.FC<Props> = ({
  as: Tag = 'div',
  children,
  isFocused,
  scrollIntoViewOptions = { block: 'nearest', inline: 'nearest' },
  ...rest
}) => {
  const selfRef = React.useRef<any>(null);

  useDeepCompareEffect(() => {
    if (isFocused) {
      // jsdom doesn't support scrollIntoView
      selfRef.current?.scrollIntoView?.(scrollIntoViewOptions);
    }
  }, [isFocused, scrollIntoViewOptions]);

  return (
    <Tag ref={selfRef} {...rest}>
      {children}
    </Tag>
  );
};

export default ScrollIntoViewWithFocus;
