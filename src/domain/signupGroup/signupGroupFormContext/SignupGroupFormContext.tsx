import React, {
  createContext,
  FC,
  PropsWithChildren,
  useMemo,
  useState,
} from 'react';

import useMountedState from '../../../hooks/useMountedState';
import { SIGNUP_MODALS } from '../../signup/constants';
// eslint-disable-next-line max-len
import PersonsAddedToWaitingListModal from '../modals/personsAddedToWaitingListModal/PersonsAddedToWaitingListModal';

export type SignupGroupFormContextProps = {
  closeModal: () => void;
  openModal: SIGNUP_MODALS | null;
  openModalId: string | null;
  openParticipant: number | null;
  setOpenModal: (state: SIGNUP_MODALS | null) => void;
  setOpenModalId: (state: string | null) => void;
  setOpenParticipant: (index: number | null) => void;
  toggleOpenParticipant: (index: number) => void;
};

export const SignupGroupFormContext = createContext<
  SignupGroupFormContextProps | undefined
>(undefined);

export const SignupGroupFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [openParticipant, setOpenParticipant] = useState<number | null>(0);

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
      setOpenModal,
      setOpenModalId,
      setOpenParticipant,
      toggleOpenParticipant: (newIndex: number) => {
        setOpenParticipant(openParticipant === newIndex ? null : newIndex);
      },
    }),
    [openModal, openModalId, openParticipant, setOpenModal, setOpenModalId]
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
