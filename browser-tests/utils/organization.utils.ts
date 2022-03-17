import { OrganizationFieldsFragment } from '../../src/generated/graphql';
import { removeEmpty } from './utils';

export const getExpectedOrganizationContext = (
  organization: Partial<OrganizationFieldsFragment>,
  ...fieldsToPick: Array<keyof OrganizationFieldsFragment>
): Partial<OrganizationFieldsFragment> =>
  removeEmpty(
    fieldsToPick.reduce(
      (fields, field) => ({ ...fields, [field]: organization[field] }),
      { id: organization.id, name: organization.name }
    )
  );
