import { ButtonVariant, IconArrowLeft } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import Button from '../../common/components/button/Button';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import {
  EventFieldsFragment,
  PublicationStatus,
  useEventQuery,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import getPathBuilder from '../../utils/getPathBuilder';
import getValue from '../../utils/getValue';
import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import useEventWithEducationKeywordsData from '../event/hooks/useEventWithEducationKeywordsData';
import {
  clearEventFormData,
  eventPathBuilder,
  getEventFields,
} from '../event/utils';
import NotFound from '../notFound/NotFound';
import styles from './eventSavedPage.module.scss';

type EventSavedPageProps = {
  event: EventFieldsFragment;
};

const EventSavedPage: React.FC<EventSavedPageProps> = ({ event }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();

  const { publicationStatus } = getEventFields(event, locale);

  const goToEvents = () => {
    navigate(`/${locale}${ROUTES.EVENTS}`);
  };

  const goToCreateEvent = () => {
    clearEventFormData();
    navigate(`/${locale}${ROUTES.CREATE_EVENT}`);
  };

  return (
    <PageWrapper
      title={
        publicationStatus === PublicationStatus.Draft
          ? t('eventSavedPage.pageTitleDraftSaved')
          : t(`eventSavedPage.pageTitlePublished`)
      }
    >
      <Container withOffset={true}>
        <h1>
          {publicationStatus === PublicationStatus.Draft
            ? t('eventSavedPage.titleDraftSaved')
            : t(`eventSavedPage.titlePublished`)}
        </h1>

        <div className={styles.buttonPanel}>
          <Button
            onClick={goToEvents}
            iconStart={<IconArrowLeft />}
            variant={ButtonVariant.Secondary}
          >
            {t('eventSavedPage.buttonBackToEvents')}
          </Button>
          <Button onClick={goToCreateEvent} variant={ButtonVariant.Primary}>
            {t('common.buttonAddEvent')}
          </Button>
        </div>
      </Container>
    </PageWrapper>
  );
};

const EventSavedPageWrapper: React.FC = () => {
  const { id: eventId } = useParams<{ id: string }>();

  const { data: eventData, loading } = useEventQuery({
    skip: !eventId,
    variables: {
      id: getValue(eventId, ''),
      createPath: getPathBuilder(eventPathBuilder),
    },
  });

  const event = useEventWithEducationKeywordsData(eventData);

  return (
    <MainContent>
      <LoadingSpinner isLoading={loading}>
        {event ? <EventSavedPage event={event} /> : <NotFound />}
      </LoadingSpinner>
    </MainContent>
  );
};

export default EventSavedPageWrapper;
