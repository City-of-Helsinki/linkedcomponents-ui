import { IconPhoto } from 'hds-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { ImageFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import formatDate from '../../../utils/formatDate';
import { getImageFields, getImageItemId } from '../../image/utils';
import styles from './imagesTable.module.scss';

interface Props {
  image: ImageFieldsFragment;
  onRowClick: (image: ImageFieldsFragment) => void;
}

const KeywordsTableRow: React.FC<Props> = ({ image, onRowClick }) => {
  const locale = useLocale();
  const actionsDropdownRef = React.useRef<HTMLDivElement>(null);
  const rowRef = React.useRef<HTMLTableRowElement>(null);

  const { id, imageUrl, name, lastModifiedTime, url } = getImageFields(
    image,
    locale
  );

  const handleRowClick = (ev: React.MouseEvent) => {
    /* istanbul ignore else */
    if (
      ev.target instanceof Node &&
      rowRef.current?.contains(ev.target) &&
      !actionsDropdownRef.current?.contains(ev.target)
    ) {
      onRowClick(image);
    }
  };

  const handleKeyDown = (ev: React.KeyboardEvent) => {
    /* istanbul ignore else */
    if (ev.key === 'Enter' && ev.target === rowRef.current) {
      onRowClick(image);
    }
  };

  return (
    <>
      <tr
        ref={rowRef}
        role="button"
        aria-label={name}
        id={getImageItemId(id)}
        data-testid={id}
        onClick={handleRowClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <td className={styles.imageColumn}>
          <div className={styles.imagePreview}>
            {imageUrl ? (
              <div
                className={styles.image}
                style={{ backgroundImage: `url(${url})` }}
              />
            ) : (
              <div className={styles.placeholderImage}>
                <IconPhoto size="xl" />
              </div>
            )}
          </div>
        </td>
        <td className={styles.idColumn}>
          {
            <Link
              onClick={/* istanbul ignore next */ (e) => e.preventDefault()}
              to={imageUrl}
            >
              {id}
            </Link>
          }
        </td>
        <td className={styles.nameColumn}>{name}</td>
        <td className={styles.lastModifiedTimeColumn}>
          {formatDate(lastModifiedTime)}
        </td>
        <td className={styles.actionButtonsColumn}></td>
      </tr>
    </>
  );
};

export default KeywordsTableRow;
