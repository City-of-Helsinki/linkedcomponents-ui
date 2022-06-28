import { FieldArray, useField } from 'formik';
import React, { useContext, useState } from 'react';

import { ENROLMENT_FIELDS } from '../../constants';
import EnrolmentPageContext from '../../enrolmentPageContext/EnrolmentPageContext';
import ConfirmDeleteParticipantModal from '../../modals/confirmDeleteParticipantModal/ConfirmDeleteParticipantModal';
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
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

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
              const closeModal = () => {
                setOpenModalIndex(null);
              };

              const openModal = () => {
                setOpenModalIndex(index);
              };

              const deleteParticipant = () => {
                setSaving(true);

                // TODO: Update reservation from API when BE is ready
                updateEnrolmentReservationData(
                  registration,
                  attendees.length - 1
                );
                arrayHelpers.remove(index);

                setSaving(false);
                closeModal();
              };

              return (
                <React.Fragment key={index}>
                  <ConfirmDeleteParticipantModal
                    isOpen={openModalIndex === index}
                    isSaving={saving}
                    onClose={closeModal}
                    onDelete={deleteParticipant}
                    participantCount={1}
                  />
                  <Attendee
                    attendee={attendee}
                    attendeePath={getAttendeePath(index)}
                    disabled={disabled}
                    index={index}
                    onDelete={openModal}
                    showDelete={attendees.length > 1}
                  />
                </React.Fragment>
              );
            })}
          </div>
        )}
      />
    </div>
  );
};

export default Attendees;
