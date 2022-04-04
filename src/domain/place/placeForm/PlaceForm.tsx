import { Form, Formik } from 'formik';
import React from 'react';

import { PlaceFieldsFragment } from '../../../generated/graphql';
import styles from '../../admin/layout/form.module.scss';
import { PLACE_ACTIONS, PLACE_INITIAL_VALUES } from '../constants';
import PlaceAuthenticationNotification from '../placeAuthenticationNotification/PlaceAuthenticationNotification';
import { getPlaceInitialValues } from '../utils';
import { placeSchema } from '../validation';

type PlaceFormProps = {
  place?: PlaceFieldsFragment;
};

const PlaceForm: React.FC<PlaceFormProps> = ({ place }) => {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={
        place ? getPlaceInitialValues(place) : PLACE_INITIAL_VALUES
      }
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs

      onSubmit={/* istanbul ignore next */ () => undefined}
      validateOnMount
      validateOnBlur={true}
      validateOnChange={true}
      validationSchema={placeSchema}
    >
      {({ values }) => {
        return (
          <Form className={styles.form} noValidate={true}>
            <PlaceAuthenticationNotification
              action={place ? PLACE_ACTIONS.UPDATE : PLACE_ACTIONS.CREATE}
              publisher={place ? (place.publisher as string) : values.publisher}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default PlaceForm;
