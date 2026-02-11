import React from 'react';
import { useTranslation } from 'react-i18next';

import { GetOptionFunction, OptionType } from '../types';
import useLocale from './useLocale';

/**
 * Custom hook for managing selector initial options with change tracking.
 * Sets initial options from data and updates them only when the tracked
 * dependencies change.
 * NOTE: This is needed when HDS Select options are initialized via onSearch and
 * will only set the initial options.
 * @param data - Array of data items to convert to options
 * @param getOption - Function to convert data item to OptionType
 * @param dependencies - Array of values to track for changes (like variables, etc.)
 * @returns Array of options for the selector
 */
const useInitialSelectorOptions = <T>(
  data: T[] | undefined,
  getOption: GetOptionFunction<T>,
  dependencies: unknown[] = []
): OptionType[] => {
  const locale = useLocale();
  const { t } = useTranslation();
  const [options, setOptions] = React.useState<OptionType[]>([]);

  const memoizedDependencies = React.useMemo(
    () => [locale, ...dependencies],
    [dependencies, locale]
  );
  const previousDependenciesRef = React.useRef<unknown[]>([]);

  // Check if any tracked value has changed
  const hasChanges = React.useMemo(
    () =>
      memoizedDependencies.some(
        (value, index) => previousDependenciesRef.current[index] !== value
      ),
    [memoizedDependencies]
  );

  React.useEffect(() => {
    if (data && (options.length === 0 || hasChanges)) {
      setOptions(data.map((item) => getOption(item, locale, t)));
      previousDependenciesRef.current = memoizedDependencies;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, options.length, hasChanges, getOption, locale, t]);

  return options;
};

export default useInitialSelectorOptions;
