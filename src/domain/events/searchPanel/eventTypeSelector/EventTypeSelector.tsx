import { IconHeart } from 'hds-react';
import { FC } from 'react';

import MultiSelectDropdown from '../../../../common/components/multiSelectDropdown/MultiSelectDropdown';
import { OptionType } from '../../../../types';
import skipFalsyType from '../../../../utils/skipFalsyType';
import { EVENT_TYPE } from '../../../event/constants';

type Props = {
  onChange: (newTypes: OptionType[]) => void;
  options: OptionType[];
  toggleButtonLabel: string;
  value: EVENT_TYPE[];
};

const EventTypeSelector: FC<Props> = ({
  onChange,
  options,
  toggleButtonLabel,
  value,
}) => {
  return (
    <MultiSelectDropdown
      icon={<IconHeart aria-hidden />}
      onChange={onChange}
      options={options}
      showSearch={true}
      toggleButtonLabel={toggleButtonLabel}
      value={value
        .map((type) => options.find((item) => item.value === type))
        .filter(skipFalsyType)}
    />
  );
};

export default EventTypeSelector;
