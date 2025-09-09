import { useField } from 'formik';
import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';

import Button from '../../../../common/components/button/Button';
import { ROUTES } from '../../../../constants';
import {
  EventFieldsFragment,
  PublicationStatus,
  SuperEventType,
} from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../../hooks/useQueryStringWithReturnPath';
import getValue from '../../../../utils/getValue';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import Section from '../../../app/layout/section/Section';
import useOrganizationAncestors from '../../../organization/hooks/useOrganizationAncestors';
import { checkCanUserDoRegistrationAction } from '../../../registration/permissions';
import { REGISTRATION_ACTIONS } from '../../../registrations/constants';
import useUser from '../../../user/hooks/useUser';
import { EVENT_FIELDS } from '../../constants';
import {
  copyEventInfoToRegistrationSessionStorage,
  getEventFields,
} from '../../utils';
import styles from './registrationSection.module.scss';

export type RegistrationSectionProps = {
  event: EventFieldsFragment;
};

const RegistrationSection: React.FC<RegistrationSectionProps> = ({ event }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();
  const queryStringWithReturnPath = useQueryStringWithReturnPath();
  const { publisher, registrationUrl } = getEventFields(event, locale);
  const { organizationAncestors } = useOrganizationAncestors(
    getValue(publisher, '')
  );
  const { user } = useUser();
  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });

  const renderSection = (children: React.ReactNode) => {
    return (
      <Section title={t('event.form.sections.registration')}>
        <FieldRow>
          <FieldColumn>{children}</FieldColumn>
        </FieldRow>
      </Section>
    );
  };

  if (registrationUrl) {
    const registrationUrlWithReturnPath = `${registrationUrl}${queryStringWithReturnPath}`;

    return renderSection(
      <Link className={styles.eventLink} to={registrationUrlWithReturnPath}>
        {t('event.form.linkGoToRegistration')}
      </Link>
    );
  }

  if (
    (
      [null, SuperEventType.Recurring] as Array<typeof event.superEventType>
    ).includes(event.superEventType) &&
    event.publicationStatus === PublicationStatus.Public &&
    checkCanUserDoRegistrationAction({
      action: REGISTRATION_ACTIONS.CREATE,
      organizationAncestors,
      registration: { atId: event.registration?.atId as string, publisher },
      user,
    })
  ) {
    return renderSection(
      <Button
        iconLeft={<IconPlus aria-hidden />}
        onClick={async () => {
          await copyEventInfoToRegistrationSessionStorage(event);
          navigate(`/${locale}${ROUTES.CREATE_REGISTRATION}`);
        }}
        type="button"
      >
        {t(`event.form.buttonAddRegistration.${type}`)}
      </Button>
    );
  }

  return null;
};

export default RegistrationSection;
