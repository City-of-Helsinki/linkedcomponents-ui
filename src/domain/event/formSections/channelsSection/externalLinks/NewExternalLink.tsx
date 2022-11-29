import React from 'react';
import { useTranslation } from 'react-i18next';

import SingleSelect from '../../../../../common/components/singleSelect/SingleSelect';
import TextInput from '../../../../../common/components/textInput/TextInput';
import { OptionType } from '../../../../../types';
import FieldColumn from '../../../../app/layout/fieldColumn/FieldColumn';
import useExtlinkOptions from '../../../hooks/useExtlinkOptions';
import styles from './externalLinks.module.scss';

type ExternalLinkProps = {
  isEditingAllowed: boolean;
  onChange: (item: OptionType) => void;
  type: string;
};

const NewExternalLink: React.FC<ExternalLinkProps> = ({
  isEditingAllowed,
  onChange,
  type,
}) => {
  const { t } = useTranslation();

  const options = useExtlinkOptions();

  const handleChange = (item: OptionType) => {
    onChange(item);
  };

  return (
    <FieldColumn>
      <fieldset className={styles.externalLink}>
        <legend>{t(`event.form.labelNewExternalLinkName`)}</legend>

        <SingleSelect
          className={styles.nameSelector}
          disabled={!isEditingAllowed}
          label={t(`event.form.labelNewExternalLinkName`)}
          onChange={handleChange}
          options={options}
          placeholder={t(`common.select`) as string}
          value={null as unknown as undefined}
        />
        <TextInput
          id="new-some-link-input"
          className={styles.newLinkField}
          disabled
          hideLabel={true}
          label={t(`event.form.labelNewExternalLinkLink.${type}`)}
          placeholder={t('event.form.placeholderNewExternalLinkLink') as string}
        />
      </fieldset>
    </FieldColumn>
  );
};

export default NewExternalLink;
