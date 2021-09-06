import { FieldArray, useField } from 'formik';
import React from 'react';

import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import { EVENT_FIELDS, EXTERNAL_LINK_FIELDS } from '../../../constants';
import { ExternalLink as ExternalLinkType } from '../../../types';
import ExternalLink from './ExternalLink';
import NewExternalLink from './NewExternalLink';

const ExternalLinks: React.FC = () => {
  const [{ value: externalLinks }] = useField<ExternalLinkType[]>({
    name: EVENT_FIELDS.EXTERNAL_LINKS,
  });
  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });

  return (
    <FieldArray
      name={EVENT_FIELDS.EXTERNAL_LINKS}
      render={(arrayHelpers) => (
        <div>
          {externalLinks.map((externalLink, index: number) => {
            return (
              <FormGroup key={index}>
                <ExternalLink
                  key={index}
                  externalLink={externalLink}
                  index={index}
                  onDelete={() => arrayHelpers.remove(index)}
                  type={type}
                />
              </FormGroup>
            );
          })}

          <NewExternalLink
            onChange={(item) =>
              arrayHelpers.push({
                [EXTERNAL_LINK_FIELDS.NAME]: item.value,
                [EXTERNAL_LINK_FIELDS.LINK]: '',
              })
            }
            type={type}
          />
        </div>
      )}
    />
  );
};

export default ExternalLinks;
