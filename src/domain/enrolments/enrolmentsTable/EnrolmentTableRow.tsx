import { IconCheck } from 'hds-react';
import React from 'react';

import { Enrolment, Registration } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import ActionsDropdown from '../actionsDropdown/ActionsDropdown';
import { getEnrolmentFields, getEnrolmentItemId } from '../utils';
import styles from './enrolmentsTable.module.scss';

interface Props {
  enrolment: Enrolment;
  registration: Registration;
  onRowClick: (enrolment: Enrolment) => void;
}

const EnrolmentTableRow: React.FC<Props> = ({
  enrolment,
  onRowClick,
  registration,
}) => {
  const locale = useLocale();
  const actionsDropdownRef = React.useRef<HTMLDivElement>(null);
  const rowRef = React.useRef<HTMLTableRowElement>(null);

  const { email, id, name, phoneNumber } = getEnrolmentFields({
    enrolment,
    language: locale,
    registration,
  });

  const handleRowClick = (ev: React.MouseEvent) => {
    /* istanbul ignore else */
    if (
      ev.target instanceof Node &&
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
        <td className={styles.genderColumn}>-</td>
        <td className={styles.emailColumn}>{email}</td>
        <td className={styles.phoneColumn}>{phoneNumber}</td>
        <td className={styles.statusColumn}>
          <IconCheck className={styles.statusOk} />
        </td>
        <td className={styles.actionButtonsColumn}>
          <ActionsDropdown
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
