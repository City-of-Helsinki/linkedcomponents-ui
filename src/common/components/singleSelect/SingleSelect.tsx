import classNames from 'classnames';
import { css } from 'emotion';
import { Select, SingleSelectProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import { OptionType } from '../../../types';
import {
  getA11ySelectionMessage,
  getA11yStatusMessage,
} from '../../../utils/accessibilityUtils';

const SingleSelect: React.FC<SingleSelectProps<OptionType>> = ({
  className,
  ...rest
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Select
      {...rest}
      className={classNames(className, css(theme.select))}
      getA11yStatusMessage={(options) => getA11yStatusMessage(options, t)}
      getA11ySelectionMessage={(options) =>
        /* istanbul ignore next */ getA11ySelectionMessage(options, t)
      }
    />
  );
};

export default SingleSelect;
