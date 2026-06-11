import classNames from 'classnames';
import { Select as HDSSelect } from 'hds-react';
import React, { ComponentProps } from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import useLocale from '../../../hooks/useLocale';
import SelectLoadingSpinner, {
  SelectLoadingSpinnerProps,
} from '../selectLoadingSpinner/SelectLoadingSpinner';
import styles from './singleSelect.module.scss';

export type SingleSelectProps = SelectLoadingSpinnerProps & {
  className?: string;
} & ComponentProps<typeof HDSSelect>;

const SingleSelect: React.FC<SingleSelectProps> = ({
  alignedLabel,
  className,
  isLoading,
  texts,
  ...rest
}) => {
  const locale = useLocale();
  const { theme } = useTheme();

  const memoizedTexts = React.useMemo(
    () => ({ language: locale, ...texts }),
    [locale, texts]
  );

  return (
    <SelectLoadingSpinner alignedLabel={alignedLabel} isLoading={isLoading}>
      <HDSSelect
        {...rest}
        className={classNames(className, styles.select)}
        texts={memoizedTexts}
        theme={theme.select}
        children={undefined}
      />
    </SelectLoadingSpinner>
  );
};

export default SingleSelect;
