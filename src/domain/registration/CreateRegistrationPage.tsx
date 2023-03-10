import React from 'react';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import useUser from '../user/hooks/useUser';
import RegistrationForm from './registrationForm/RegistrationForm';
import styles from './registrationPage.module.scss';

const CreateRegistrationPage: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper
      className={styles.registrationPage}
      title={`createRegistrationPage.pageTitle`}
    >
      <LoadingSpinner isLoading={loadingUser}>
        <RegistrationForm />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default CreateRegistrationPage;
