import React from 'react';
import { useTranslation } from 'react-i18next';

import SingleSelect from '../../../../../common/components/singleSelect/SingleSelect';
import TextInput from '../../../../../common/components/textInput/TextInput';
import { OptionType } from '../../../../../types';
import getValue from '../../../../../utils/getValue';
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

  const handleChange = (
    _selectedOptions: OptionType[],
    clickedOption: OptionType
  ) => {
    onChange(clickedOption);
  };

  return (
    <FieldColumn>
      <fieldset className={styles.externalLink}>
        <legend>{t(`event.form.labelNewExternalLinkName`)}</legend>

        <SingleSelect
          className={styles.nameSelector}
          disabled={!isEditingAllowed}
          onChange={handleChange}
          options={options}
          texts={{
            label: t(`event.form.labelNewExternalLinkName`),
            placeholder: getValue(t(`common.select`), undefined),
          }}
        />
        <TextInput
          id="new-some-link-input"
          className={styles.newLinkField}
          disabled
          hideLabel={true}
          label={t(`event.form.labelNewExternalLinkLink.${type}`)}
          placeholder={getValue(
            t('event.form.placeholderNewExternalLinkLink'),
            undefined
          )}
        />
      </fieldset>
    </FieldColumn>
  );
};

export default NewExternalLink;
