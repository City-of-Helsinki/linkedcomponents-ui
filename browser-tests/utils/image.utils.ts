import { ImageFieldsFragment } from '../../src/generated/graphql';
import { removeEmpty } from './utils';

export const getExpectedImageContext = (
  image: Partial<ImageFieldsFragment>,
  ...fieldsToPick: Array<keyof ImageFieldsFragment>
): Partial<ImageFieldsFragment> =>
  removeEmpty(
    fieldsToPick.reduce(
      (fields, field) => ({ ...fields, [field]: image[field] }),
      { id: image.id, name: image.name }
    )
  );
