import { IconPhoto } from 'hds-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import Table from '../../../common/components/table/Table';
import { ImageFieldsFragment, ImagesQuery } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../hooks/useQueryStringWithReturnPath';
import formatDate from '../../../utils/formatDate';
import getSortByOrderAndColKey from '../../../utils/getSortByOrderAndColKey';
import getSortOrderAndKey from '../../../utils/getSortOrderAndKey';
import { getImageFields, getImageItemId } from '../../image/utils';
import { IMAGE_SORT_OPTIONS } from '../constants';
import ImageActionsDropdown from '../imageActionsDropdown/ImageActionsDropdown';
import styles from './imagesTable.module.scss';

export interface ImagesTableProps {
  caption: string;
  className?: string;
  images: ImagesQuery['images']['data'];
  setSort: (sort: IMAGE_SORT_OPTIONS) => void;
  sort: IMAGE_SORT_OPTIONS;
}

const ImageColumn = (image: ImageFieldsFragment) => {
  const locale = useLocale();
  const { url } = getImageFields(image, locale);

  return (
    <div className={styles.imagePreview}>
      {url ? (
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${url})` }}
        />
      ) : (
        /* istanbul ignore next */
        <div className={styles.placeholderImage}>
          <IconPhoto size="xl" />
        </div>
      )}
    </div>
  );
};

const IdColumn = (image: ImageFieldsFragment) => {
  const locale = useLocale();
  const { imageUrl, id } = getImageFields(image, locale);

  return (
    <Link
      onClick={/* istanbul ignore next */ (e) => e.preventDefault()}
      to={imageUrl}
    >
      {id}
    </Link>
  );
};

const NameColumn = (image: ImageFieldsFragment) => {
  const locale = useLocale();
  const { name } = getImageFields(image, locale);

  return <>{name}</>;
};

const LastModifiedTimeColumn = (image: ImageFieldsFragment) => {
  const locale = useLocale();
  const { lastModifiedTime } = getImageFields(image, locale);

  return <>{formatDate(lastModifiedTime)}</>;
};

const ActionColumn = (image: ImageFieldsFragment) => {
  return <ImageActionsDropdown image={image} />;
};

const ImagesTable: React.FC<ImagesTableProps> = ({
  caption,
  className,
  images,
  setSort,
  sort,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();
  const queryStringWithReturnPath = useQueryStringWithReturnPath();

  const handleRowClick = (image: object) => {
    const { imageUrl } = getImageFields(image as ImageFieldsFragment, locale);

    navigate({
      pathname: imageUrl,
      search: queryStringWithReturnPath,
    });
  };

  const handleSortChange = (key: string) => {
    setSort(key as IMAGE_SORT_OPTIONS);
  };

  const { initialSortingColumnKey, initialSortingOrder } = useMemo(() => {
    const { colKey, order } = getSortOrderAndKey(sort);

    return {
      initialSortingColumnKey: colKey,
      initialSortingOrder: order,
    };
  }, [sort]);

  return (
    <Table
      caption={caption}
      className={className}
      cols={[
        {
          className: styles.imageColumn,
          key: 'image',
          headerName: t('imagesPage.imagesTableColumns.image'),
          transform: ImageColumn,
        },
        {
          className: styles.idColumn,
          key: 'id',
          headerName: t('imagesPage.imagesTableColumns.id'),
          transform: IdColumn,
        },
        {
          className: styles.nameColumn,
          key: 'name',
          headerName: t('imagesPage.imagesTableColumns.name'),
          transform: NameColumn,
        },
        {
          className: styles.lastModifiedTimeColumn,
          isSortable: true,
          key: IMAGE_SORT_OPTIONS.LAST_MODIFIED_TIME,
          headerName: t('imagesPage.imagesTableColumns.lastModifiedTime'),
          sortIconType: 'other',
          transform: LastModifiedTimeColumn,
        },
        {
          className: styles.actionButtonsColumn,
          key: 'actionButtons',
          headerName: '',
          onClick: (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
          },
          transform: ActionColumn,
        },
      ]}
      getRowProps={(image) => {
        const { id, name } = getImageFields(
          image as ImageFieldsFragment,
          locale
        );

        return {
          'aria-label': name,
          'data-testid': id,
          id: getImageItemId(id),
        };
      }}
      indexKey="id"
      initialSortingColumnKey={initialSortingColumnKey}
      initialSortingOrder={initialSortingOrder}
      onRowClick={handleRowClick}
      onSort={(order, colKey, handleSort) => {
        handleSortChange(getSortByOrderAndColKey({ order, colKey }));
        handleSort();
      }}
      rows={images as ImageFieldsFragment[]}
      variant="light"
    />
  );
};

export default ImagesTable;
