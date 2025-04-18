/* eslint-disable max-len */
import { FieldProps, useField } from 'formik';
import { ButtonVariant, IconAngleDown, IconAngleUp } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../../types';
import { getErrorText } from '../../../../utils/validationUtils';
import { useAccessibilityNotificationContext } from '../../accessibilityNotificationContext/hooks/useAccessibilityNotificationContext';
import Button from '../../button/Button';
import Checkbox from '../../checkbox/Checkbox';
import SelectionGroup, {
  SelectionGroupProps,
} from '../../selectionGroup/SelectionGroup';
import styles from './checkboxGroupField.module.scss';

export type CheckboxGroupFieldProps = React.PropsWithChildren<
  {
    disabledOptions: string[];
    errorName?: string;
    min: number;
    options: OptionType[];
    visibleOptionAmount?: number;
  } & FieldProps &
    SelectionGroupProps
>;

const CheckboxGroupField: React.FC<CheckboxGroupFieldProps> = ({
  columns = 2,
  disabled,
  disabledOptions,
  field: { name, onBlur, value, ...field },
  form,
  errorName,
  min = 0,
  options,
  visibleOptionAmount,
  ...rest
}) => {
  const { t } = useTranslation();
  const [, { error, touched: touchedError }] = useField(errorName || name);
  const [, { touched }] = useField(name);
  const { setAccessibilityText } = useAccessibilityNotificationContext();

  const errorText = getErrorText(error, touched || touchedError, t);
  const [showAll, setShowAll] = React.useState(false);

  const visibleOptions = [...options].slice(
    0,
    showAll ? undefined : visibleOptionAmount
  );

  const toggleShowAll = () => {
    setAccessibilityText(
      t(
        showAll
          ? 'common.checkboxGroup.accessibility.hideOptionsNotification'
          : 'common.checkboxGroup.accessibility.showAllOptionsNotification'
      )
    );
    setShowAll((o) => !o);
  };

  const handleBlur = () => {
    onBlur({ target: { id: name, value } });
  };

  return (
    <>
      <SelectionGroup
        {...rest}
        columns={columns}
        errorText={errorText}
        id={errorName || name}
      >
        {visibleOptions.map((option) => {
          const checked = Boolean(value?.includes(option.value));

          return (
            <Checkbox
              key={option.value}
              {...field}
              id={`${name}-${option.value}`}
              name={name}
              checked={checked}
              disabled={
                disabled ||
                (checked && value.length <= min) ||
                disabledOptions?.includes(option.value ?? '')
              }
              onBlur={handleBlur}
              value={option.value}
              label={option.label}
            />
          );
        })}
      </SelectionGroup>
      {visibleOptionAmount && options.length > visibleOptionAmount && (
        <div className={styles.buttonWrapper}>
          <Button
            disabled={disabled}
            fullWidth={true}
            iconStart={showAll ? <IconAngleUp /> : <IconAngleDown />}
            onClick={toggleShowAll}
            variant={ButtonVariant.Supplementary}
          >
            {showAll ? t('common.showLess') : t('common.showMore')}
          </Button>
        </div>
      )}
    </>
  );
};

export default CheckboxGroupField;
