import React from 'react';
import { useTranslation } from 'react-i18next';

import SingleSelect from '../../../../../common/components/singleSelect/SingleSelect';
import TextInput from '../../../../../common/components/textInput/TextInput';
import { OptionType } from '../../../../../types';
import useExtlinkOptions from '../../../hooks/useExtlinkOptions';
import FieldColumn from '../../../layout/FieldColumn';
import styles from './externalLinks.module.scss';

type ExternalLinkProps = {
  onChange: (item: OptionType) => void;
  type: string;
};

const NewExternalLink: React.FC<ExternalLinkProps> = ({ onChange, type }) => {
  const { t } = useTranslation();

  const options = useExtlinkOptions();

  const handleChange = (item: OptionType) => {
    onChange(item);
  };

  return (
    <FieldColumn>
      <div className={styles.externalLink}>
        <SingleSelect
          className={styles.nameSelector}
          label={t(`event.form.labelNewExternalLinkName`)}
          onChange={handleChange}
          options={options}
          placeholder={t(`common.select`)}
          required
          value={null as unknown as undefined}
        />
        <TextInput
          id="new-some-link-input"
          disabled
          hideLabel={true}
          label={t(`event.form.labelNewExternalLinkLink.${type}`)}
          placeholder={t('event.form.placeholderNewExternalLinkLink')}
        />
      </div>
    </FieldColumn>
  );
};

export default NewExternalLink;
