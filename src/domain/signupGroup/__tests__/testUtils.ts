import { screen, userEvent, within } from '../../../utils/testUtils';

export const findFirstNameInputs = () => screen.findAllByLabelText(/etunimi/i);

export const getSignupFormElement = (
  key:
    | 'cityInput'
    | 'confirmDeleteModal'
    | 'dateOfBirthInput'
    | 'emailCheckbox'
    | 'emailInput'
    | 'firstNameInput'
    | 'lastNameInput'
    | 'membershipNumberInput'
    | 'menu'
    | 'nativeLanguageButton'
    | 'participantAmountInput'
    | 'phoneCheckbox'
    | 'phoneInput'
    | 'serviceLanguageButton'
    | 'signupGroupExtraInfoField'
    | 'streetAddressInput'
    | 'submitButton'
    | 'toggle'
    | 'updateParticipantAmountButton'
    | 'zipInput'
) => {
  switch (key) {
    case 'cityInput':
      return screen.getByLabelText(/kaupunki/i);
    case 'confirmDeleteModal':
      return screen.getByRole('dialog', {
        name: 'Vahvista osallistujan poistaminen',
      });
    case 'dateOfBirthInput':
      return screen.getByLabelText(/syntymäaika/i);
    case 'emailCheckbox':
      return screen.getByLabelText(/sähköpostilla/i);
    case 'emailInput':
      return screen.getByLabelText(/sähköpostiosoite/i);
    case 'firstNameInput':
      return screen.getAllByLabelText(/etunimi/i)[0];
    case 'lastNameInput':
      return screen.getAllByLabelText(/sukunimi/i)[0];
    case 'membershipNumberInput':
      return screen.getByLabelText(/jäsenkortin numero/i);
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
    case 'nativeLanguageButton':
      return screen.getByRole('button', { name: /äidinkieli/i });
    case 'participantAmountInput':
      return screen.getByRole('spinbutton', {
        name: /ilmoittautujien määrä \*/i,
      });
    case 'phoneCheckbox':
      return screen.getByLabelText(/tekstiviestillä/i);
    case 'phoneInput':
      return screen.getByLabelText(/puhelinnumero/i);
    case 'serviceLanguageButton':
      return screen.getByRole('button', { name: /asiointikieli/i });
    case 'signupGroupExtraInfoField':
      return screen.getByRole('textbox', {
        name: 'Lisätietoa ilmoittautumisesta (valinnainen)',
      });
    case 'streetAddressInput':
      return screen.getByLabelText(/katuosoite/i);
    case 'submitButton':
      return screen.getByRole('button', { name: /tallenna osallistuja/i });
    case 'toggle':
      return screen.getByRole('button', { name: /valinnat/i });
    case 'updateParticipantAmountButton':
      return screen.getByRole('button', { name: /päivitä/i });
    case 'zipInput':
      return screen.getByLabelText(/postinumero/i);
  }
};

export const openMenu = async () => {
  const user = userEvent.setup();
  const toggleButton = getSignupFormElement('toggle');
  await user.click(toggleButton);
  const menu = getSignupFormElement('menu');

  return { menu, toggleButton };
};

export const tryToCancel = async () => {
  const user = userEvent.setup();

  const { menu } = await openMenu();
  const cancelButton = await within(menu).findByRole('button', {
    name: 'Peruuta osallistuminen',
  });
  await user.click(cancelButton);

  const dialog = screen.getByRole('dialog', {
    name: 'Haluatko varmasti poistaa ilmoittautumisen?',
  });

  const confirmCancelButton = within(dialog).getByRole('button', {
    name: 'Peruuta ilmoittautuminen',
  });
  await user.click(confirmCancelButton);
};

export const tryToUpdate = async () => {
  const user = userEvent.setup();
  const submitButton = getSignupFormElement('submitButton');
  await user.click(submitButton);
};
