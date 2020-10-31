import { enGB, fi, sv } from 'date-fns/locale';

export const DATE_FORMAT = 'dd.MM.yyyy';
export const DATETIME_FORMAT = `${DATE_FORMAT} HH.mm`;

export const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
export const datetimeRegex = /^\d{2}\.\d{2}\.\d{4} \d{2}.\d{2}$/;

export const dateLocales = { fi, en: enGB, sv };
