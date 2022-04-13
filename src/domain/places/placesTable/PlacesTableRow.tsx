import React from 'react';
import { Link } from 'react-router-dom';

import { PlaceFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { getPlaceFields, getPlaceItemId } from '../../place/utils';
import PlaceActionsDropdown from '../placeActionsDropdown/PlaceActionsDropdown';
import styles from './placesTable.module.scss';

interface Props {
  onRowClick: (place: PlaceFieldsFragment) => void;
  place: PlaceFieldsFragment;
}

const PlacesTableRow: React.FC<Props> = ({ onRowClick, place }) => {
  const locale = useLocale();
  const actionsDropdownRef = React.useRef<HTMLDivElement>(null);
  const rowRef = React.useRef<HTMLTableRowElement>(null);

  const { id, name, nEvents, placeUrl, streetAddress } = getPlaceFields(
    place,
    locale
  );

  const handleRowClick = (ev: React.MouseEvent) => {
    /* istanbul ignore else */
    if (
      ev.target instanceof Node &&
      rowRef.current?.contains(ev.target) &&
      !actionsDropdownRef.current?.contains(ev.target)
    ) {
      onRowClick(place);
    }
  };

  const handleKeyDown = (ev: React.KeyboardEvent) => {
    /* istanbul ignore else */
    if (ev.key === 'Enter' && ev.target === rowRef.current) {
      onRowClick(place);
    }
  };

  return (
    <>
      <tr
        ref={rowRef}
        role="button"
        aria-label={name}
        id={getPlaceItemId(id)}
        data-testid={id}
        onClick={handleRowClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <td className={styles.idColumn}>
          {
            <Link
              onClick={/* istanbul ignore next */ (e) => e.preventDefault()}
              to={placeUrl}
            >
              {id}
            </Link>
          }
        </td>
        <td className={styles.nameColumn}>{name}</td>
        <td className={styles.nEventsColumn}>{nEvents}</td>
        <td className={styles.streetAddressColumn}>{streetAddress}</td>
        <td className={styles.actionButtonsColumn}>
          <PlaceActionsDropdown ref={actionsDropdownRef} place={place} />
        </td>
      </tr>
    </>
  );
};

export default PlacesTableRow;
