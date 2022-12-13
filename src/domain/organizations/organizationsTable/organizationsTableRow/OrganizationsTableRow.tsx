import { IconAngleDown, IconAngleUp } from 'hds-react';
import omit from 'lodash/omit';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import { OrganizationFieldsFragment } from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
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

const OrganizationsTableRow: React.FC<OrganizationsTableRowProps> = ({
  level = 0,
  organization,
}) => {
  const { onRowClick, showSubOrganizations, sortedOrganizations } = useContext(
    OrganizationsTableContext
  );
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const locale = useLocale();
  const {
    organizations: {
      addExpandedOrganization,
      expandedOrganizations,
      removeExpandedOrganization,
    },
  } = usePageSettings();
  const rowRef = React.useRef<HTMLTableRowElement>(null);

  const {
    affiliatedOrganizations,
    classification,
    dataSource,
    fullName,
    id,
    organizationUrl,
    parentOrganization: parentOrganizationAtId,
    subOrganizations,
  } = getOrganizationFields(organization, locale, t);
  const subOrganizationIds = [...affiliatedOrganizations, ...subOrganizations];
  const parentOrganization = sortedOrganizations.find(
    (o) => o.atId === parentOrganizationAtId
  );
  const { name: parentOrganizationName } = parentOrganization
    ? getOrganizationFields(parentOrganization, locale, t)
    : { name: '' };

  const open = expandedOrganizations.includes(id);

  const toggle = (ev: React.MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    if (open) {
      removeExpandedOrganization(id);
    } else {
      addExpandedOrganization(id);
    }
  };

  const handleRowClick = (ev: React.MouseEvent) => {
    /* istanbul ignore else */
    if (ev.target instanceof Node && rowRef.current?.contains(ev.target)) {
      onRowClick(organization);
    }
  };

  const handleKeyDown = (ev: React.KeyboardEvent) => {
    /* istanbul ignore else */
    if (ev.key === 'Enter' && ev.target === rowRef.current) {
      onRowClick(organization);
    }
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
      <tr
        ref={rowRef}
        role="button"
        aria-label={fullName}
        id={getOrganizationItemId(id)}
        className={styles.clickableRow}
        data-testid={id}
        onClick={handleRowClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <td className={styles.nameColumn}>
          <div
            className={styles.nameWrapper}
            style={{ paddingLeft: `calc(${level} * var(--spacing-m))` }}
          >
            {showSubOrganizations && !!subOrganizationIds.length && (
              <button
                aria-label={
                  open
                    ? (t(
                        'organizationsPage.organizationsTable.hideSubOrganizations',
                        { name: fullName }
                      ) as string)
                    : (t(
                        'organizationsPage.organizationsTable.showSubOrganizations',
                        { name: fullName }
                      ) as string)
                }
                onClick={toggle}
              >
                {open ? (
                  <IconAngleUp aria-hidden={true} size="s" />
                ) : (
                  <IconAngleDown aria-hidden={true} size="s" />
                )}
              </button>
            )}
            <span className={styles.organizationName} title={fullName}>
              <Link
                onClick={/* istanbul ignore next */ (e) => e.preventDefault()}
                to={organizationUrl}
              >
                {fullName}
              </Link>
            </span>
          </div>
        </td>

        <td className={styles.idColumn}>{id}</td>
        <td className={styles.dataSourceColumn}>
          <DataSourceName id={dataSource} />
        </td>
        <td className={styles.classificationColumn}>
          <OrganizationClassName id={classification} />
        </td>
        <td className={styles.parentColumn}>
          <div className={styles.nameWrapper}>
            <span
              className={styles.organizationName}
              title={parentOrganizationName}
            >
              {parentOrganizationName || /* istanbul ignore next */ '–'}
            </span>
          </div>
        </td>
        <td
          className={styles.actionButtonsColumn}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
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
