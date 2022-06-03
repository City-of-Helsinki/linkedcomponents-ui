import { FieldProps } from 'formik';
import React from 'react';

import ImageSelector, {
  ImageSelectorProps,
} from '../../imageSelector/ImageSelector';

type Props = ImageSelectorProps & FieldProps;

const ImageSelectorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  ...rest
}) => {
  const handleBlur = () => {
    onBlur({ target: { id: name, value } });
  };

  const handleChange = (selected: string[]) => {
    onChange({
      target: { id: name, value: selected },
    });
  };

  return (
    <ImageSelector
      {...rest}
      {...field}
      onBlur={handleBlur}
      onChange={handleChange}
      value={value}
    />
  );
};

export default ImageSelectorField;
