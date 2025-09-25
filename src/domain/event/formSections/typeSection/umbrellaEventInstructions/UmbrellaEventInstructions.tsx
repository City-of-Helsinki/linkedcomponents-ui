import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { ROUTES } from '../../../../../constants';
import {
  EventFieldsFragment,
  SuperEventType,
} from '../../../../../generated/graphql';
import useLocale from '../../../../../hooks/useLocale';

export type UmbrellaEventInstructionsProps = {
  savedEvent?: EventFieldsFragment | null;
};

const UmbrellaEventInstructions: FC<UmbrellaEventInstructionsProps> = ({
  savedEvent,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const typeOfSuperEvent = savedEvent?.superEvent?.superEventType;
  const superEventId = savedEvent?.superEvent?.id;

  return (
    <>
      <p>{t('event.form.infoTextUmrellaEvent1')}</p>
      <p>{t('event.form.infoTextUmrellaEvent2')}</p>
      {superEventId && typeOfSuperEvent === SuperEventType.Recurring && (
        <p>
          {t('event.form.infoTextUmbrellaSubEvent')}{' '}
          <Link
            to={`/${locale}${ROUTES.EDIT_EVENT.replace(':id', superEventId)}`}
          >
            {t('event.form.infoTextUmbrellaSubEventLink')}.
          </Link>
        </p>
      )}
    </>
  );
};

export default UmbrellaEventInstructions;
