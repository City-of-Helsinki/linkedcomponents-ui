import {
  OrganizationClassesQueryVariables,
  OrganizationClassFieldsFragment,
  OrganizationClassQueryVariables,
} from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import queryBuilder from '../../utils/queryBuilder';
import { OrganizationClassFields } from './types';

export const organizationClassPathBuilder = ({
  args,
}: PathBuilderProps<OrganizationClassQueryVariables>): string => {
  const { id } = args;

  return `/organization_class/${id}/`;
};

export const organizationClassesPathBuilder = ({
  args,
}: PathBuilderProps<OrganizationClassesQueryVariables>): string => {
  const { page, pageSize } = args;

  const variableToKeyItems = [
    { key: 'page', value: page },
    { key: 'page_size', value: pageSize },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/organization_class/${query}`;
};

export const getOrganizationClassFields = (
  organizationClass: OrganizationClassFieldsFragment
): OrganizationClassFields => {
  const id = organizationClass.id ?? '';

  return {
    id,
    name: organizationClass.name ?? '',
  };
};
