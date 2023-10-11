import React, {
  createContext,
  FC,
  PropsWithChildren,
  useMemo,
  useState,
} from 'react';

import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useMountedState from '../../../hooks/useMountedState';
import { getSeatsReservationData } from '../../seatsReservation/utils';
import { SIGNUP_MODALS } from '../../signup/constants';
// eslint-disable-next-line max-len
import PersonsAddedToWaitingListModal from '../modals/personsAddedToWaitingListModal/PersonsAddedToWaitingListModal';

export type SignupGroupFormContextProps = {
  closeModal: () => void;
  openModal: SIGNUP_MODALS | null;
  openModalId: string | null;
  openParticipant: number | null;
  participantAmount: number;
  setOpenModal: (state: SIGNUP_MODALS | null) => void;
  setOpenModalId: (state: string | null) => void;
  setOpenParticipant: (index: number | null) => void;
  setParticipantAmount: (amount: number) => void;
  toggleOpenParticipant: (index: number) => void;
};

export const SignupGroupFormContext = createContext<
  SignupGroupFormContextProps | undefined
>(undefined);

type SignupGroupFormProviderProps = {
  registration: RegistrationFieldsFragment;
};

export const SignupGroupFormProvider: FC<
  PropsWithChildren<SignupGroupFormProviderProps>
> = ({ children, registration }) => {
  const [openParticipant, setOpenParticipant] = useState<number | null>(0);
  const [participantAmount, setParticipantAmount] = useState(
    Math.max(getSeatsReservationData(registration.id as string)?.seats ?? 0, 1)
  );
  const [openModal, setOpenModal] = useMountedState<SIGNUP_MODALS | null>(null);
  const [openModalId, setOpenModalId] = useMountedState<string | null>(null);

  const value: SignupGroupFormContextProps = useMemo(
    () => ({
      closeModal: () => {
        setOpenModalId(null);
        setOpenModal(null);
      },
      openModal,
      openModalId,
      openParticipant,
      participantAmount,
      setOpenModal,
      setOpenModalId,
      setOpenParticipant,
      setParticipantAmount,
      toggleOpenParticipant: (newIndex: number) => {
        setOpenParticipant(openParticipant === newIndex ? null : newIndex);
      },
    }),
    [
      openModal,
      openModalId,
      openParticipant,
      participantAmount,
      setOpenModal,
      setOpenModalId,
    ]
  );

  return (
    <SignupGroupFormContext.Provider value={value}>
      <PersonsAddedToWaitingListModal
        isOpen={openModal === SIGNUP_MODALS.PERSONS_ADDED_TO_WAITLIST}
        onClose={value.closeModal}
      />
      {children}
    </SignupGroupFormContext.Provider>
  );
};
