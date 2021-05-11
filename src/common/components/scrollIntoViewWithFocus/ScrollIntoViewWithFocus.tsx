import React from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

interface Props {
  as?: 'div' | 'li';
  className?: string;
  children: React.ReactNode;
  isFocused: boolean;
  // eslint-disable-next-line no-undef
  scrollIntoViewOptions?: ScrollIntoViewOptions;
}

const ScrollIntoViewWithFocus: React.FC<Props> = ({
  as: Tag = 'div',
  children,
  className,
  isFocused,
  scrollIntoViewOptions = { block: 'nearest', inline: 'nearest' },
  ...rest
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selfRef = React.useRef<any>(null);

  useDeepCompareEffect(() => {
    if (isFocused) {
      // jsdom doesn't support scrollIntoView
      selfRef.current?.scrollIntoView?.(scrollIntoViewOptions);
    }
  }, [isFocused, scrollIntoViewOptions]);

  return (
    <Tag {...rest} className={className} ref={selfRef}>
      {children}
    </Tag>
  );
};

export default ScrollIntoViewWithFocus;
