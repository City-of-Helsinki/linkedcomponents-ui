/* eslint-disable @typescript-eslint/no-explicit-any */
import { A11yStatusMessageOptions } from 'downshift';
import { TFunction } from 'i18next';

export const getA11yStatusMessage = (
  { isOpen, resultCount, previousResultCount }: A11yStatusMessageOptions<any>,
  t: TFunction
): string => {
  if (!isOpen) {
    return '';
  }

  if (!resultCount) {
    return t('common.dropdownSelect.accessibility.noResults');
  }

  if (resultCount !== previousResultCount) {
    return t('common.dropdownSelect.accessibility.statusMessage', {
      count: resultCount,
    });
  }

  return '';
};

export const getA11ySelectionMessage = (
  { selectedItem, itemToString }: A11yStatusMessageOptions<any>,
  t: TFunction
): string => {
  return t('common.dropdownSelect.accessibility.selectionMessage', {
    value: itemToString(selectedItem),
  });
};
