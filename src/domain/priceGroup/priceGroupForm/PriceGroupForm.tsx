/* eslint-disable max-len */
import { ServerError } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ValidationError } from 'yup';

import CheckboxField from '../../../common/components/formFields/checkboxField/CheckboxField';
import PublisherSelectorField from '../../../common/components/formFields/publisherSelectorField/PublisherSelectorField';
import TextInputField from '../../../common/components/formFields/textInputField/TextInputField';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import {
  LE_DATA_LANGUAGES,
  ORDERED_LE_DATA_LANGUAGES,
  ROUTES,
} from '../../../constants';
import { PriceGroupFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getValue from '../../../utils/getValue';
import lowerCaseFirstLetter from '../../../utils/lowerCaseFirstLetter';
import {
  scrollToFirstError,
  showFormErrors,
} from '../../../utils/validationUtils';
import styles from '../../admin/layout/form.module.scss';
import FormRow from '../../admin/layout/formRow/FormRow';
import useAdminFormStyles from '../../admin/layout/hooks/useAdminFormStyles';
import { useNotificationsContext } from '../../app/notificationsContext/hooks/useNotificationsContext';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import {
  PRICE_GROUP_ACTIONS,
  PRICE_GROUP_FIELDS,
  PRICE_GROUP_INITIAL_VALUES,
} from '../constants';
import CreateButtonPanel from '../createButtonPanel/CreateButtonPanel';
import EditButtonPanel from '../editButtonPanel/EditButtonPanel';
import usePriceGroupActions from '../hooks/usePriceGroupActions';
import usePriceGroupServerErrors from '../hooks/usePriceGroupServerErrors';
import PriceGroupAuthenticationNotification from '../priceGroupAuthenticationNotification/PriceGroupAuthenticationNotification';
import { PriceGroupFormFields } from '../types';
import {
  checkCanUserDoPriceGroupAction,
  getPriceGroupInitialValues,
} from '../utils';
import { getFocusablePriceGroupFieldId, priceGroupSchema } from '../validation';

type PriceGroupFormProps = {
  priceGroup?: PriceGroupFieldsFragment;
};

const PriceGroupForm: React.FC<PriceGroupFormProps> = ({ priceGroup }) => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationsContext();
  const locale = useLocale();
  const navigate = useNavigate();
  const { user } = useUser();

  const action = priceGroup
    ? PRICE_GROUP_ACTIONS.UPDATE
    : PRICE_GROUP_ACTIONS.CREATE;
  const savedPlacePublisher = getValue(priceGroup?.publisher, '');

  const { organizationAncestors } =
    useOrganizationAncestors(savedPlacePublisher);

  const { createPriceGroup, saving, updatePriceGroup } = usePriceGroupActions({
    priceGroup,
  });

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    usePriceGroupServerErrors();

  const goToPriceGroupsPage = () => {
    navigate(`/${locale}${ROUTES.PRICE_GROUPS}`);
  };

  const onCreate = async (values: PriceGroupFormFields) => {
    await createPriceGroup(values, {
      onError: (error: ServerError) => showServerErrors({ error }),
      onSuccess: goToPriceGroupsPage,
    });
  };

  const onUpdate = async (values: PriceGroupFormFields) => {
    await updatePriceGroup(values, {
      onError: (error: ServerError) => showServerErrors({ error }),
      onSuccess: () => {
        goToPriceGroupsPage();
        addNotification({
          label: t('priceGroup.form.notificationPriceGroupUpdated'),
          type: 'success',
        });
      },
    });
  };

  const isEditingAllowed = checkCanUserDoPriceGroupAction({
    action,
    organizationAncestors,
    publisher: savedPlacePublisher,
    user,
  });

  const { alignedInputStyle, inputRowBorderStyle } = useAdminFormStyles({
    instance: priceGroup,
    isEditingAllowed,
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={
        priceGroup
          ? getPriceGroupInitialValues(priceGroup)
          : PRICE_GROUP_INITIAL_VALUES
      }
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs

      onSubmit={
        /* istanbul ignore next */
        () => undefined
      }
      validateOnMount
      validateOnBlur={true}
      validateOnChange={false}
      validationSchema={isEditingAllowed && priceGroupSchema}
    >
      {({ setErrors, setTouched, values }) => {
        const clearErrors = () => setErrors({});

        const publisher = priceGroup ? savedPlacePublisher : values.publisher;

        const disabledIfEditing = !isEditingAllowed || !!priceGroup;

        const handleSubmit = async (
          event?: React.FormEvent<HTMLFormElement>
        ) => {
          event?.preventDefault();

          try {
            setServerErrorItems([]);
            clearErrors();

            await priceGroupSchema.validate(values, { abortEarly: false });

            if (priceGroup) {
              await onUpdate(values);
            } else {
              await onCreate(values);
            }
          } catch (error) {
            showFormErrors({
              error: error as ValidationError,
              setErrors,
              setTouched,
            });

            scrollToFirstError({
              error: error as ValidationError,
              getFocusableFieldId: getFocusablePriceGroupFieldId,
            });
          }
        };

        return (
          <Form noValidate={true}>
            <PriceGroupAuthenticationNotification
              action={action}
              publisher={publisher}
            />

            <ServerErrorSummary errors={serverErrorItems} />

            <FormRow className={styles.borderInMobile}>
              <Field
                className={styles.alignedInputWithFullBorder}
                component={TextInputField}
                label={t(`priceGroup.form.labelId`)}
                name={PRICE_GROUP_FIELDS.ID}
                readOnly
              />
            </FormRow>
            <FormRow className={styles.borderInMobile}>
              <Field
                alignedLabel
                className={styles.alignedSelect}
                clearable={!priceGroup}
                component={PublisherSelectorField}
                disabled={disabledIfEditing}
                texts={{ label: t(`priceGroup.form.labelPublisher`) }}
                name={PRICE_GROUP_FIELDS.PUBLISHER}
                required={true}
              />
            </FormRow>
            {ORDERED_LE_DATA_LANGUAGES.map((language) => {
              const langText = lowerCaseFirstLetter(
                t(`form.inLanguage.${language}`)
              );

              return (
                <FormRow key={language} className={inputRowBorderStyle}>
                  <Field
                    className={alignedInputStyle}
                    component={TextInputField}
                    label={`${t(
                      'priceGroup.form.labelDescription'
                    )} (${langText})`}
                    name={`${PRICE_GROUP_FIELDS.DESCRIPTION}.${language}`}
                    readOnly={!isEditingAllowed}
                    required={language === LE_DATA_LANGUAGES.FI}
                  />
                </FormRow>
              );
            })}

            <FormRow>
              <Field
                component={CheckboxField}
                disabled={!isEditingAllowed}
                label={t(`priceGroup.form.labelIsFree`)}
                name={PRICE_GROUP_FIELDS.IS_FREE}
              />
            </FormRow>

            {priceGroup ? (
              <EditButtonPanel
                id={values.id}
                onSave={handleSubmit}
                publisher={publisher}
                saving={saving}
              />
            ) : (
              <CreateButtonPanel
                onSave={handleSubmit}
                publisher={publisher}
                saving={saving}
              />
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default PriceGroupForm;
