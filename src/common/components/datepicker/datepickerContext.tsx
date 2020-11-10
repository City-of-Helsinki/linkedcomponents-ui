import { createContext } from 'react';

export const datepickerContextDefaultValue: DatepickerContext = {
  focusedDate: null,
  selectedDate: null,
  isDateFocused: (date: Date) => false,
  isDateSelected: (date: Date) => false,
  isDateHovered: (date: Date) => false,
  isDateBlocked: (date: Date) => false,
  isFirstOrLastSelectedDate: () => false,
  maxBookingDate: undefined,
  minBookingDate: undefined,
  onDateFocus: () => undefined,
  onDateHover: () => undefined,
  onDateSelect: () => undefined,
};

type DatepickerContext = {
  focusedDate: Date | null;
  selectedDate: Date | null;
  isDateFocused: (date: Date) => boolean;
  isDateSelected: (date: Date) => boolean;
  isDateHovered: (date: Date) => boolean;
  isDateBlocked: (date: Date) => boolean;
  isFirstOrLastSelectedDate: (date: Date) => boolean;
  maxBookingDate?: Date;
  minBookingDate?: Date;
  onDateFocus: (date: Date) => void;
  onDateHover: (date: Date) => void;
  onDateSelect: (date: Date) => void;
};

export default createContext(datepickerContextDefaultValue);
