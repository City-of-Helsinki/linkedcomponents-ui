import { FieldArray, useField } from 'formik';
import React, { useContext } from 'react';

import { ENROLMENT_FIELDS } from '../../constants';
import EnrolmentPageContext from '../../enrolmentPageContext/EnrolmentPageContext';
import { AttendeeFields } from '../../types';
import { updateEnrolmentReservationData } from '../../utils';
import Attendee from './attendee/Attendee';
import styles from './attendees.module.scss';

const getAttendeePath = (index: number) =>
  `${ENROLMENT_FIELDS.ATTENDEES}[${index}]`;

interface Props {
  disabled?: boolean;
}

const Attendees: React.FC<Props> = ({ disabled }) => {
  const { registration } = useContext(EnrolmentPageContext);
  const [{ value: attendees }] = useField<AttendeeFields[]>({
    name: ENROLMENT_FIELDS.ATTENDEES,
  });

  return (
    <div className={styles.accordions}>
      <FieldArray
        name={ENROLMENT_FIELDS.ATTENDEES}
        render={(arrayHelpers) => (
          <div>
            {attendees.map((attendee, index: number) => {
              return (
                <Attendee
                  key={index}
                  attendee={attendee}
                  attendeePath={getAttendeePath(index)}
                  disabled={disabled}
                  index={index}
                  onDelete={() => {
                    // TODO: Update reservation from API when BE is ready
                    updateEnrolmentReservationData(
                      registration,
                      attendees.length - 1
                    );
                    arrayHelpers.remove(index);
                  }}
                  showDelete={attendees.length > 1}
                />
              );
            })}
          </div>
        )}
      />
    </div>
  );
};

export default Attendees;
