import { DATE_FIELDS } from '../common/components/dateSelectorDropdown/DateSelectorDropdown';
import { OptionType } from '../types';

type UseEventSearchHelpersState = {
  handleChangeDate: (field: DATE_FIELDS, value: Date | null) => void;
  handleChangeEventStatuses: (newStatuses: OptionType[]) => void;
  handleChangeEventTypes: (newTypes: OptionType[]) => void;
  handleChangePlaces: (newPlaces: OptionType[]) => void;
  handleChangePublishers: (newPublishers: OptionType[]) => void;
  handleChangeText: (text: string) => void;
  handleChangeTypes: (newTypes: OptionType[]) => void;
};

const useEventSearchHelpers = (
  setSearchState: (value: Record<string, unknown>) => void
): UseEventSearchHelpersState => {
  const handleChangeDate = (field: DATE_FIELDS, value: Date | null) => {
    switch (field) {
      case DATE_FIELDS.END_DATE:
        setSearchState({ end: value });
        break;
      case DATE_FIELDS.START_DATE:
        setSearchState({ start: value });
        break;
    }
  };

  const handleChangeEventStatuses = (newStatuses: OptionType[]) => {
    setSearchState({ eventStatus: newStatuses.map((type) => type.value) });
  };

  const handleChangeEventTypes = (newTypes: OptionType[]) => {
    setSearchState({ eventType: newTypes.map((type) => type.value) });
  };

  const handleChangePlaces = (newPlaces: OptionType[]) => {
    setSearchState({ place: newPlaces.map((item) => item.value) });
  };

  const handleChangePublishers = (newPublishers: OptionType[]) => {
    setSearchState({ publisher: newPublishers.map((p) => p.value) });
  };

  const handleChangeText = (text: string) => {
    setSearchState({ text });
  };

  const handleChangeTypes = (newTypes: OptionType[]) => {
    setSearchState({ type: newTypes.map((type) => type.value) });
  };

  return {
    handleChangeDate,
    handleChangeEventStatuses,
    handleChangeEventTypes,
    handleChangePlaces,
    handleChangePublishers,
    handleChangeText,
    handleChangeTypes,
  };
};

export default useEventSearchHelpers;
