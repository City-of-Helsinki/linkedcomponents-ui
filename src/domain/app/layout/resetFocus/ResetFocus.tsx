import React from 'react';
import { matchPath, PathPattern, useLocation } from 'react-router';

import useLocale from '../../../../hooks/useLocale';

/**
 * Ensure that browser focus is set to body when navigating using
 * <Link> from react-router-dom.
 */
interface Props {
  disabled?: boolean;
  ignoredPaths: PathPattern[];
}
const ResetFocus: React.FC<Props> = ({ disabled, ignoredPaths }) => {
  const locale = useLocale();
  const { pathname } = useLocation();
  const node = React.useRef<HTMLDivElement>(null);

  const isMatch = React.useCallback(
    (paths: PathPattern[]) =>
      paths.some((path) =>
        matchPath(
          {
            path: `/${locale}${path.path}`,
            end: path.end ?? /* istanbul ignore next */ true,
          },
          pathname
        )
      ),
    [locale, pathname]
  );

  React.useEffect(() => {
    if (!disabled && !isMatch(ignoredPaths)) {
      node.current?.focus();
    }
  }, [disabled, ignoredPaths, isMatch]);

  return <div ref={node} tabIndex={-1}></div>;
};

export default ResetFocus;
