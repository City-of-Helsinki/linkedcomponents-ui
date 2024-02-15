import omit from 'lodash/omit';
import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import CollapseButton from '../../../../common/components/table/collapseButton/CollapseButton';
import { OrganizationFieldsFragment } from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import getValue from '../../../../utils/getValue';
import { scrollToItem } from '../../../../utils/scrollToItem';
import { usePageSettings } from '../../../app/hooks/usePageSettings';
import DataSourceName from '../../../dataSource/dataSourceName/DataSourceName';
import { getOrganizationFields } from '../../../organization/utils';
import OrganizationClassName from '../../../organizationClass/organizationClassName/OrganizationClassName';
import OrganizationActionsDropdown from '../../organizationActionsDropdown/OrganizationActionsDropdown';
import { OrganizationsLocationState } from '../../types';
import { getOrganizationItemId } from '../../utils';
import styles from '../organizationsTable.module.scss';
import OrganizationsTableContext from '../OrganizationsTableContext';
import SubOrganizationRows from '../subOrganizationRows/SubOrganizationRows';

export interface OrganizationsTableRowProps {
  level?: number;
  organization: OrganizationFieldsFragment;
}

type NameColumnProps = {
  level?: number;
  open: boolean;
  organization: OrganizationFieldsFragment;
  showCollapseButton: boolean;
  toggle: () => void;
};

const NameColumn: FC<NameColumnProps> = ({
  level,
  open,
  organization,
  showCollapseButton,
  toggle,
}) => {
  const locale = useLocale();
  const { t } = useTranslation();

  const { fullName, id, organizationUrl } = getOrganizationFields(
    organization,
    locale,
    t
  );

  return (
    <div
      className={styles.nameWrapper}
      style={{ paddingLeft: `calc(${level} * var(--spacing-m))` }}
    >
      {showCollapseButton && (
        <CollapseButton
          ariaLabel={t(
            open
              ? 'organizationsPage.organizationsTable.hideSubOrganizations'
              : 'organizationsPage.organizationsTable.showSubOrganizations',
            { name: fullName }
          )}
          onClick={toggle}
          open={open}
        />
      )}
      <span className={styles.organizationName} title={fullName}>
        <Link id={getOrganizationItemId(id)} to={organizationUrl}>
          {fullName}
        </Link>
      </span>
    </div>
  );
};

type ParentOrganizationColumnProps = {
  organization: OrganizationFieldsFragment;
};

const ParentOrganizationColumn: FC<ParentOrganizationColumnProps> = ({
  organization,
}) => {
  const locale = useLocale();
  const { t } = useTranslation();

  const { parentOrganization: parentOrganizationAtId } = getOrganizationFields(
    organization,
    locale,
    t
  );
  const { sortedOrganizations } = useContext(OrganizationsTableContext);
  const parentOrganization = sortedOrganizations.find(
    (o) => o.atId === parentOrganizationAtId
  );
  const { name: parentOrganizationName } = parentOrganization
    ? getOrganizationFields(parentOrganization, locale, t)
    : { name: '' };

  return (
    <div className={styles.nameWrapper}>
      <span className={styles.organizationName} title={parentOrganizationName}>
        {getValue(parentOrganizationName, '–')}
      </span>
    </div>
  );
};

const OrganizationsTableRow: React.FC<OrganizationsTableRowProps> = ({
  level = 0,
  organization,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const locale = useLocale();

  const rowRef = React.useRef<HTMLTableRowElement>(null);

  const { showSubOrganizations } = useContext(OrganizationsTableContext);
  const {
    organizations: {
      addExpandedOrganization,
      expandedOrganizations,
      removeExpandedOrganization,
    },
  } = usePageSettings();

  const {
    affiliatedOrganizations,
    classification,
    dataSource,
    id,
    subOrganizations,
  } = getOrganizationFields(organization, locale, t);
  const subOrganizationIds = [...affiliatedOrganizations, ...subOrganizations];

  const open = expandedOrganizations.includes(id);

  const toggle = () => {
    open ? removeExpandedOrganization(id) : addExpandedOrganization(id);
  };

  React.useEffect(() => {
    const locationState = location.state as OrganizationsLocationState;
    if (locationState?.organizationId) {
      scrollToItem(getOrganizationItemId(locationState.organizationId));
      // Clear organizationId value to keep scroll position correctly
      const state = omit(locationState, 'organizationId');
      // location.search seems to reset if not added here (...location)
      navigate(location, { state, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <tr ref={rowRef} data-testid={id}>
        <td className={styles.nameColumn}>
          <NameColumn
            level={level}
            open={open}
            organization={organization}
            showCollapseButton={
              showSubOrganizations && !!subOrganizationIds.length
            }
            toggle={toggle}
          />
        </td>

        <td className={styles.idColumn}>{id}</td>
        <td className={styles.dataSourceColumn}>
          <DataSourceName id={dataSource} />
        </td>
        <td className={styles.classificationColumn}>
          <OrganizationClassName id={classification} />
        </td>
        <td className={styles.parentColumn}>
          <ParentOrganizationColumn organization={organization} />
        </td>
        <td>
          <OrganizationActionsDropdown organization={organization} />
        </td>
      </tr>
      {!!subOrganizationIds.length && open && (
        <SubOrganizationRows organizationId={id} level={level} />
      )}
    </>
  );
};

export default OrganizationsTableRow;
