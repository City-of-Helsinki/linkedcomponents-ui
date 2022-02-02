import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  EnrolmentFieldsFragment,
  RegistrationFieldsFragment,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import EnrolmentActionsDropdown from '../enrolmentActionsDropdown/EnrolmentActionsDropdown';
import { getEnrolmentFields, getEnrolmentItemId } from '../utils';
import styles from './enrolmentsTable.module.scss';

interface Props {
  enrolment: EnrolmentFieldsFragment;
  registration: RegistrationFieldsFragment;
  onRowClick: (enrolment: EnrolmentFieldsFragment) => void;
}

const EnrolmentTableRow: React.FC<Props> = ({
  enrolment,
  onRowClick,
  registration,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const actionsDropdownRef = React.useRef<HTMLDivElement>(null);
  const rowRef = React.useRef<HTMLTableRowElement>(null);

  const { attendeeStatus, email, id, name, phoneNumber } = getEnrolmentFields({
    enrolment,
    language: locale,
    registration,
  });

  const handleRowClick = (ev: React.MouseEvent) => {
    /* istanbul ignore else */
    if (
      ev.target instanceof Node &&
      rowRef.current?.contains(ev.target) &&
      !actionsDropdownRef.current?.contains(ev.target)
    ) {
      onRowClick(enrolment);
    }
  };

  const handleKeyDown = (ev: React.KeyboardEvent) => {
    /* istanbul ignore else */
    if (ev.key === 'Enter' && ev.target === rowRef.current) {
      onRowClick(enrolment);
    }
  };

  return (
    <>
      <tr
        ref={rowRef}
        role="button"
        aria-label={name}
        id={getEnrolmentItemId(id)}
        onClick={handleRowClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <td className={styles.nameColumn}>
          <div className={styles.nameWrapper}>
            <span className={styles.enrolmentName} title={name}>
              {name}
            </span>
          </div>
        </td>
        <td className={styles.emailColumn}>
          {email || /* istanbul ignore next */ '-'}
        </td>
        <td className={styles.phoneColumn}>
          {phoneNumber || /* istanbul ignore next */ '-'}
        </td>
        <td className={styles.statusColumn}>
          {t(`enrolment.attendeeStatus.${attendeeStatus}`)}
        </td>
        <td className={styles.actionButtonsColumn}>
          <EnrolmentActionsDropdown
            ref={actionsDropdownRef}
            enrolment={enrolment}
            registration={registration}
          />
        </td>
      </tr>
    </>
  );
};

export default EnrolmentTableRow;
