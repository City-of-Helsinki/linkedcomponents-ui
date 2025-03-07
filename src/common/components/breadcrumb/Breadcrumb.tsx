import {
  Breadcrumb as HdsBreadcrumb,
  BreadcrumbCustomTheme,
  BreadcrumbProps as HdsBreadcrumbProps,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';

export type BreadcrumbProps = { ariaLabel?: string } & Omit<
  HdsBreadcrumbProps,
  'aria-label'
>;

const Breadcrumb = ({
  ariaLabel,
  ...rest
}: BreadcrumbProps): React.ReactElement => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <HdsBreadcrumb
      {...rest}
      aria-label={ariaLabel ?? t('common.breadcrumb')}
      theme={theme.breadcrumb as BreadcrumbCustomTheme}
    />
  );
};

export default Breadcrumb;
