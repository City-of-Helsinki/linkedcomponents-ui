// LE returns always error message in a single language, so use i18n to translate

import { TFunction } from 'i18next';

import { LEServerError } from '../types';

// error message to used UI language
const parseServerErrorMessage = ({
  error,
  t,
}: {
  error: LEServerError;
  t: TFunction;
}): string => {
  let errorStr = '';
  if (typeof error === 'string') {
    errorStr = error;
  } else if (Array.isArray(error)) {
    const e =
      typeof error[0] === 'object'
        ? Object.values(error[0]).find((item) => item)
        : error[0];
    errorStr = Array.isArray(e) ? e[0] : e;
  } else {
    const e = Object.values(error).find((item) => item);
    errorStr = Array.isArray(e) ? e[0] : e;
  }

  const noSeatsLeftStart = `Not enough seats available. Capacity left: `;
  if (errorStr.startsWith(noSeatsLeftStart)) {
    const seatsLeft = errorStr.split(noSeatsLeftStart)[1].split('.')[0];
    return t(`serverError.notEnoughSeats`, { seatsLeft });
  }

  const noWaitingListSeatsLeftStart = `Not enough capacity in the waiting list. Capacity left: `;
  if (errorStr.startsWith(noWaitingListSeatsLeftStart)) {
    const seatsLeft = errorStr
      .split(noWaitingListSeatsLeftStart)[1]
      .split('.')[0];
    return t(`serverError.notEnoughWaitingListSeats`, { seatsLeft });
  }

  switch (errorStr) {
    case 'An object with given id already exists.':
    case 'Arvon tulee olla uniikki.':
      return t(`serverError.mustBeUnique`);
    case 'Arvo saa olla enintään 255 merkkiä pitkä.':
      return t(`serverError.maxLength255`);
    case 'Could not find all objects to update.':
      return t(`serverError.notFoundAllObjects`);
    case 'End time cannot be in the past. Please set a future end time.':
      return t(`serverError.endTimeInPast`);
    case 'Kenttien email, registration tulee muodostaa uniikki joukko.':
      return t(`serverError.emailMustBeUnique`);
    case 'Kenttien phone_number, registration tulee muodostaa uniikki joukko.':
      return t(`serverError.phoneNumberMustBeUnique`);
    case 'Metodi "DELETE" ei ole sallittu.':
      return t(`serverError.methodDeleteNotAllowed`);
    case 'Metodi "POST" ei ole sallittu.':
      return t(`serverError.methodPostNotAllowed`);
    case 'Metodi "PUT" ei ole sallittu.':
      return t(`serverError.methodPutNotAllowed`);
    case 'Price info must be specified before an event is published.':
      return t(`serverError.offersIsRequired`);
    case 'Short description length must be 160 characters or less':
      return t(`serverError.shortDescriptionTooLong`);
    case 'Syötä oikea URL-osoite.':
      return t(`serverError.invalidUrl`);
    case 'The name must be specified.':
      return t(`serverError.nameIsRequired`);
    case 'The participant is too old.':
      return t(`serverError.participantTooOld`);
    case 'The participant is too young.':
      return t(`serverError.participantTooYoung`);
    case 'This field must be specified before an event is published.':
      return t(`serverError.requiredWhenPublishing`);
    case 'Tämä kenttä ei voi olla tyhjä.':
      return t(`serverError.required`);
    case 'Tämän kentän arvo ei voi olla "null".':
      return t(`serverError.notNull`);
    case 'Tämän luvun on oltava vähintään 0.':
      return t(`serverError.min0`);
    default:
      return errorStr;
  }
};
export default parseServerErrorMessage;
