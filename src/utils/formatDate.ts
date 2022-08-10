import { format } from 'date-fns';
import { enGB as en, fi, sv } from 'date-fns/locale';

import { Language } from '../types';

const locales = { en, fi, sv };

/**
 * Format date string
 * @param date
 * @param dateFormat
 * @returns {string}
 */
const formatDate = (
  date: Date | number | null,
  dateFormat = 'd.M.yyyy',
  locale: Language = 'fi'
): string =>
  date ? format(date, dateFormat, { locale: locales[locale] }) : '';

export default formatDate;
