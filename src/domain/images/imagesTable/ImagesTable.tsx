import classNames from 'classnames';
import { IconPhoto } from 'hds-react';
import React, { FC, useMemo } from 'react';
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

type ColumnProps = {
  image: ImageFieldsFragment;
};

const ImageColumn: FC<ColumnProps> = ({ image }) => {
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

const IdColumn: FC<ColumnProps> = ({ image }) => {
  const locale = useLocale();
  const { imageUrl, id } = getImageFields(image, locale);

  return (
    <Link id={getImageItemId(id)} to={imageUrl}>
      {id}
    </Link>
  );
};

const NameColumn: FC<ColumnProps> = ({ image }) => {
  const locale = useLocale();
  const { name } = getImageFields(image, locale);

  return <>{name}</>;
};

const LastModifiedTimeColumn: FC<ColumnProps> = ({ image }) => {
  const locale = useLocale();
  const { lastModifiedTime } = getImageFields(image, locale);

  return <>{formatDate(lastModifiedTime)}</>;
};

const ActionsColumn: FC<ColumnProps> = ({ image }) => {
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

  const MemoizedImageColumn = React.useCallback(
    (image: ImageFieldsFragment) => <ImageColumn image={image} />,
    []
  );
  const MemoizedIdColumn = React.useCallback(
    (image: ImageFieldsFragment) => <IdColumn image={image} />,
    []
  );
  const MemoizeNameColumn = React.useCallback(
    (image: ImageFieldsFragment) => <NameColumn image={image} />,
    []
  );
  const MemoizeLastModifiedTimeColumn = React.useCallback(
    (image: ImageFieldsFragment) => <LastModifiedTimeColumn image={image} />,
    []
  );
  const MemoizeActionsColumn = React.useCallback(
    (image: ImageFieldsFragment) => <ActionsColumn image={image} />,
    []
  );

  return (
    <Table
      caption={caption}
      cols={[
        {
          key: 'image',
          headerName: t('imagesPage.imagesTableColumns.image'),
          transform: MemoizedImageColumn,
        },
        {
          isSortable: true,
          key: IMAGE_SORT_OPTIONS.ID,
          headerName: t('imagesPage.imagesTableColumns.id'),
          sortIconType: 'string',
          transform: MemoizedIdColumn,
        },
        {
          isSortable: true,
          key: IMAGE_SORT_OPTIONS.NAME,
          headerName: t('imagesPage.imagesTableColumns.name'),
          sortIconType: 'string',
          transform: MemoizeNameColumn,
        },
        {
          isSortable: true,
          key: IMAGE_SORT_OPTIONS.LAST_MODIFIED_TIME,
          headerName: t('imagesPage.imagesTableColumns.lastModifiedTime'),
          sortIconType: 'other',
          transform: MemoizeLastModifiedTimeColumn,
        },
        {
          key: 'actionButtons',
          headerName: t('common.actions'),
          transform: MemoizeActionsColumn,
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
