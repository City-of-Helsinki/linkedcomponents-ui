import classNames from 'classnames';
import { IconPhoto } from 'hds-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Table from '../../../common/components/table/Table';
import { ImageFieldsFragment, ImagesQuery } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useShowPlaceholderImage from '../../../hooks/useShowPlaceholderImage';
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
  const showPlaceholder = useShowPlaceholderImage(url);

  return (
    <div className={styles.imagePreview}>
      {showPlaceholder ? (
        /* istanbul ignore next */
        <div className={styles.placeholderImage}>
          <IconPhoto size="xl" />
        </div>
      ) : (
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${url})` }}
        />
      )}
    </div>
  );
};

const IdColumn = (image: ImageFieldsFragment) => {
  const locale = useLocale();
  const { imageUrl, id } = getImageFields(image, locale);

  return (
    <Link id={getImageItemId(id)} to={imageUrl}>
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
      cols={[
        {
          key: 'image',
          headerName: t('imagesPage.imagesTableColumns.image'),
          transform: ImageColumn,
        },
        {
          isSortable: true,
          key: IMAGE_SORT_OPTIONS.ID,
          headerName: t('imagesPage.imagesTableColumns.id'),
          sortIconType: 'string',
          transform: IdColumn,
        },
        {
          isSortable: true,
          key: IMAGE_SORT_OPTIONS.NAME,
          headerName: t('imagesPage.imagesTableColumns.name'),
          sortIconType: 'string',
          transform: NameColumn,
        },
        {
          isSortable: true,
          key: IMAGE_SORT_OPTIONS.LAST_MODIFIED_TIME,
          headerName: t('imagesPage.imagesTableColumns.lastModifiedTime'),
          sortIconType: 'other',
          transform: LastModifiedTimeColumn,
        },
        {
          key: 'actionButtons',
          headerName: '',
          transform: ActionColumn,
        },
      ]}
      hasActionButtons
      indexKey="id"
      initialSortingColumnKey={initialSortingColumnKey}
      initialSortingOrder={initialSortingOrder}
      onSort={(order, colKey, handleSort) => {
        handleSortChange(getSortByOrderAndColKey({ order, colKey }));
        handleSort();
      }}
      rows={images as ImageFieldsFragment[]}
      variant="light"
      wrapperClassName={classNames(className, styles.imagesTable)}
    />
  );
};

export default ImagesTable;
