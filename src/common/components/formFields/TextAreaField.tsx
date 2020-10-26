import { FieldProps } from 'formik';
import { TextAreaProps } from 'hds-react/components/Textarea';
import React from 'react';

import TextArea from '../textArea/TextArea';

type Props = FieldProps & TextAreaProps;

const TextAreaField: React.FC<Props> = ({
  field: { name, value, ...field },
  form,
  ...rest
}) => {
  return <TextArea {...rest} {...field} id={name} name={name} value={value} />;
};

export default TextAreaField;
