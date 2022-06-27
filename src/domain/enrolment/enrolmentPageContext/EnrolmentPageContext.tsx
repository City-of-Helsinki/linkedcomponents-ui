import { createContext, useState } from 'react';

import { RegistrationFieldsFragment } from '../../../generated/graphql';

type EnrolmentPageContext = {
  openParticipant: number | null;
  registration: RegistrationFieldsFragment;
  setOpenParticipant: (index: number | null) => void;
  toggleOpenParticipant: (index: number) => void;
};

export const enrolmentPageContextDefaultValue: EnrolmentPageContext = {
  openParticipant: 0,
  registration: { atId: '' },
  setOpenParticipant:
    /* istanbul ignore next */
    () => undefined,
  toggleOpenParticipant:
    /* istanbul ignore next */
    () => undefined,
};

export const useEnrolmentPageContextValue = (): Omit<
  EnrolmentPageContext,
  'registration'
> => {
  const [openParticipant, setOpenParticipant] = useState<number | null>(0);

  const toggleOpenParticipant = (newIndex: number) => {
    setOpenParticipant(openParticipant === newIndex ? null : newIndex);
  };

  return {
    openParticipant,
    setOpenParticipant,
    toggleOpenParticipant,
  };
};

export default createContext(enrolmentPageContextDefaultValue);
