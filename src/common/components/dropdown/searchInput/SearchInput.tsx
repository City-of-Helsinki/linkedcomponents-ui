import { IconSearch, IconSize } from 'hds-react';
import React from 'react';

import FieldLabel from '../../fieldLabel/FieldLabel';
import styles from '../dropdown.module.scss';

interface SearchInputProps {
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ id, onChange, placeholder, value }, ref) => {
    return (
      <div className={styles.searchInput}>
        <IconSearch size={IconSize.Small} />
        <FieldLabel hidden={true} inputId={id} label={placeholder} />
        <input
          ref={ref}
          id={id}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
        />
      </div>
    );
  }
);

export default SearchInput;
