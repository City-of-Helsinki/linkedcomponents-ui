import classNames from 'classnames';
import { css } from 'emotion';
import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import InputRow from '../../../../common/components/inputRow/InputRow';
import Notification from '../../../../common/components/notification/Notification';
import { useTheme } from '../../../app/theme/Theme';
import { EVENT_FIELDS } from '../../constants';
import Occasion from './Occasion';
import Occasions from './Occasions';
import styles from './timeSection.module.scss';

const TypeSection = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [{ value: type }] = useField(EVENT_FIELDS.TYPE);

  return (
    <div className={classNames(styles.timeSection, css(theme.timeSection))}>
      <h3>{t(`event.form.titleTime.${type}`)}</h3>

      <InputRow
        info={
          <Notification
            className={styles.notification}
            label={'TODO'}
            type="info"
          ></Notification>
        }
      >
        <Occasion occasionPath="" type={type} />
        <Occasions />
      </InputRow>
    </div>
  );
};

export default TypeSection;
